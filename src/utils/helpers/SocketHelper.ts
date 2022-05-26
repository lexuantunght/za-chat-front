import { Manager } from 'socket.io-client';
import * as appConfig from '../config/appConfig';

const manager = new Manager(appConfig.baseUrl, {
    reconnectionDelayMax: 10000,
    withCredentials: true,
});

export const socket = manager.socket('/', {
    auth: {
        'x-access-token': window.localStorage.getItem('accessToken'),
    },
});

export const connect = () => {
    manager.open((err) => {
        if (err) {
            // TODO: display error connection
            console.log(err);
        }
    });
};
