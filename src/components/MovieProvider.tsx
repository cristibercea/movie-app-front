import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import PropTypes from "prop-types";
import { getLogger } from '../core';
import { MovieProps } from './MovieProps';
import {createMovie, getMovies, newWebSocket, updateMovie} from './MovieApi';
import {AuthContext} from "../auth";

const log = getLogger('MovieProvider');

type SaveMovieFn = (movie: MovieProps) => Promise<any>;

export interface MoviesState {
    movies?: MovieProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveMovie?: SaveMovieFn,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: MoviesState = {
    fetching: false,
    saving: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: MoviesState, action: ActionProps) => MoviesState =
    (state, { type, payload }) => {
        switch(type) {
            case FETCH_ITEMS_STARTED: return { ...state, fetching: true, fetchingError: null };
            case FETCH_ITEMS_SUCCEEDED: return { ...state, movies: payload.movies, fetching: false };
            case FETCH_ITEMS_FAILED: return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_ITEM_STARTED: return { ...state, savingError: null, saving: true };
            case SAVE_ITEM_SUCCEEDED:
            {
                const movies = [...(state.movies || [])];
                const movie = payload.movie;
                const movieId = movie._id?.toString() || '';
                const index = movies.findIndex(mv => mv._id?.toString() === movieId);
                if (index === -1) movies.unshift(movie); // adaugă la început dacă nu există
                else movies[index] = movie; // înlocuiește filmul existent
                return { ...state, movies, saving: false };
            }
            case SAVE_ITEM_FAILED: return { ...state, savingError: payload.error, saving: false };
            default: return state;
        }
    };

// eslint-disable-next-line react-refresh/only-export-components
export const MovieContext = React.createContext<MoviesState>(initialState);

interface MovieProviderProps {
    children: PropTypes.ReactNodeLike,
}

const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { movies, fetching, fetchingError, saving, savingError } = state;
    useEffect(getMoviesEffect, [token]);
    useEffect(wsEffect, [token]);
    const saveMovie = useCallback<SaveMovieFn>(saveMovieCallback, [token]);
    const value = { movies, fetching, fetchingError, saving, savingError, saveMovie };
    log('returns');
    
    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );

    function getMoviesEffect() {
        let canceled = false;
        if(token) fetchMovies();
        return () => {
            canceled = true;
        }

        async function fetchMovies() {
            try {
                log('fetchMovies started');
                dispatch({ type: FETCH_ITEMS_STARTED });
                const movies = await getMovies(token);
                log('fetchMovies succeeded');
                if (!canceled) dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { movies } });
            } catch (error) {
                log('fetchMovies failed', error);
                if (!canceled) dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
            }
        }
    }

    async function saveMovieCallback(movie: MovieProps) {
        try {
            log('saveMovie started');
            dispatch({ type: SAVE_ITEM_STARTED });
            await (movie._id ? updateMovie(token, movie) : createMovie(token, movie));
            log('saveMovie succeeded'); //dispatch-ul se face ca urmare a broadcast-ului de la server
        } catch (error) {
            log('saveMovie failed');
            dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
        }
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket : () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) return;
                const {event, payload: movie } = message;
                log(`ws message, movie ${event}`);
                if (event === 'created' || event === 'updated') dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {movie}});
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};

export default MovieProvider;
