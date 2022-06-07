import { Manager } from 'socket.io-client';
import appConfig from '../../utils/app/appConfig';

class Socket {
    private manager;
    private socket;
    private static instance: Socket | null = null;
    private constructor() {
        this.manager = new Manager(appConfig.baseUrl, {
            reconnectionDelayMax: 10000,
            withCredentials: true,
        });
        this.socket = this.manager.socket('/');
    }

    public static getInstance = () => {
        if (this.instance === null) {
            this.instance = new Socket();
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

    public disconnect = () => {
        this.manager._close();
    };

    public getSocket = () => {
        return this.socket;
    };
}

export default Socket;
