import { Manager } from 'socket.io-client';
import { useLocalStorage } from '../../hooks/storage';
import * as appConfig from '../config/appConfig';

class SocketHelper {
    private manager;
    private socket;
    private static instance: SocketHelper | null = null;
    private constructor() {
        this.manager = new Manager(appConfig.baseUrl, {
            reconnectionDelayMax: 10000,
            withCredentials: true,
        });
        this.socket = this.manager.socket('/', {
            auth: {
                'x-access-token': useLocalStorage().getItem('accessToken'),
            },
        });
    }

    public static getInstance = () => {
        if (this.instance === null) {
            this.instance = new SocketHelper();
        }
        return this.instance;
    };

    public connect = () => {
        this.manager.open((err) => {
            if (err) {
                // TODO: display error connection
                console.log(err);
            }
        });
    };

    public getSocket = () => {
        return this.socket;
    };
}

export default SocketHelper;
