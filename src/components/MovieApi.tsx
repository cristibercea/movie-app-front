import axios from 'axios';
import {baseUrl, config, getLogger, movieUrl, withLogs} from '../core';
import { MovieProps } from './MovieProps';

const log = getLogger('movieAPI');

export const getMovies: () => Promise<MovieProps[]> = () => {
    return withLogs(axios.get(movieUrl, config), 'getMovies');
}

export const createMovie: (item: MovieProps) => Promise<MovieProps[]> = item => {
    return withLogs(axios.post(movieUrl, item, config), 'createMovie');
}

export const updateMovie: (item: MovieProps) => Promise<MovieProps[]> = item => {
    return withLogs(axios.put(`${movieUrl}/${item.id}`, item, config), 'updateMovie');
}

interface MessageData {
    event: string;
    payload: {
        movie: MovieProps;
    };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`)
    ws.onopen = () => {log('web socket onopen');};
    ws.onclose = () => {log('web socket onclose');};
    ws.onerror = error => {log('web socket onerror', error);};
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {ws.close();}
}