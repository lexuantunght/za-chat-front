import { Manager } from 'socket.io-client';
import * as appConfig from '../config/appConfig';

export const manager = new Manager(appConfig.baseUrl, {
    reconnectionDelayMax: 10000,
    withCredentials: true,
});
