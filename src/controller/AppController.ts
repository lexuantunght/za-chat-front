import BaseController from './BaseController';
import { Authorize } from '../domain/usecase/authentication/Authorize';
import { setUserData } from '../utils/redux/reducer';
import { SocketAction } from '../domain/usecase/realtime/SocketAction';

class AppController extends BaseController {
    private authorizeUseCase;
    private socketActionUseCase;
    constructor() {
        super();
        this.authorizeUseCase = new Authorize();
        this.socketActionUseCase = new SocketAction();
    }

    public authorize = () => {
        this.authorizeUseCase.invoke().then((user) => this.dispatch(setUserData(user)));
        this.socketActionUseCase.connect();
    };

    public emitSocket = (key: string, ...args: any[]) => {
        this.socketActionUseCase.emit(key, ...args);
    };

    public addSocketListener = (key: string, listener: (...args: any[]) => void) => {
        this.socketActionUseCase.on(key, listener);
    };

    public removeAllSocketListeners = (key: string) => {
        this.socketActionUseCase.removeAllListeners(key);
    };
}

export default AppController;
