import Socket from '../../networking/Socket';
import SocketDataSource from '../SocketDataSource';

export default class SocketAPIDataSourceImpl implements SocketDataSource {
    connect() {
        Socket.getInstance().connect();
    }

    disconnect() {
        Socket.getInstance().disconnect();
    }

    emit<T>(key: string, ...args: T[]) {
        Socket.getInstance()
            .getSocket()
            .emit(key, ...args);
    }

    on(key: string, fn: <T>(...args: T[]) => void) {
        Socket.getInstance().getSocket().on(key, fn);
    }

    removeAllListeners(key: string) {
        Socket.getInstance().getSocket().removeAllListeners(key);
    }
}
