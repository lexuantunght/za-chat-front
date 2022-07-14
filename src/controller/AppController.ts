import BaseController from './BaseController';
import { Authorize } from '../domain/usecase/authentication/Authorize';
import { SocketAction } from '../domain/usecase/realtime/SocketAction';
import {
    changeAccent,
    changeTheme,
    clearSearchResult,
    setErrorConnection,
    setUserData,
} from '../presentation/App/reducer';

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
        this.socketActionUseCase.connect(
            () => this.dispatch(setErrorConnection(true)),
            () => this.dispatch(setErrorConnection(false))
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public emitSocket = (key: string, ...args: any[]) => {
        this.socketActionUseCase.emit(key, ...args);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public addSocketListener = (key: string, listener: (...args: any[]) => void) => {
        this.socketActionUseCase.on(key, listener);
    };

    public removeAllSocketListeners = (key: string) => {
        this.socketActionUseCase.removeAllListeners(key);
    };

    public clearSearchResult = () => {
        this.dispatch(clearSearchResult());
    };

    public changeTheme = (theme: 'light' | 'dark') => {
        this.dispatch(changeTheme(theme));
    };

    public changeAccent = (accent: 'green' | 'blue' | 'red') => {
        this.dispatch(changeAccent(accent));
    };
}

export default AppController;
