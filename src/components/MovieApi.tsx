import axios from 'axios';
import {authConfig, baseUrl, getLogger, movieUrl, withLogs} from '../core';
import { MovieProps } from './MovieProps';

const log = getLogger('movieAPI');

export const getMovies: (token: string) => Promise<MovieProps[]> = token => {
    return withLogs(axios.get(movieUrl, authConfig(token)), 'getMovies');
}

export const createMovie: (token: string, movie: MovieProps) => Promise<MovieProps> = (token, movie) => {
    return withLogs(axios.post(movieUrl, movie, authConfig(token)), 'createMovie');
}

export const updateMovie: (token: string, movie: MovieProps) => Promise<MovieProps> = (token, movie) => {
    return withLogs(axios.put(`${movieUrl}/${movie._id}`, movie, authConfig(token)), 'updateMovie');
}

interface MessageData {
    event: string;
    payload: {
        movie: MovieProps;
    };
}

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`)
    ws.onopen = () => {log('web socket onopen'); ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));};
    ws.onclose = () => {log('web socket onclose');};
    ws.onerror = error => {log('web socket onerror', error);};
    ws.onmessage = messageEvent => {log('web socket onmessage'); onMessage(JSON.parse(messageEvent.data));};
    return () => {ws.close();}
}