import { SocketRepository } from '../../domain/repository/SocketRepository';
import { socketDataSource } from '../dataSource/API/SocketAPIDataSource';
import SocketDataSource from '../dataSource/SocketDataSource';

export class SocketRepositoryImpl implements SocketRepository {
    private dataSource: SocketDataSource;
    constructor(_dataSource?: SocketDataSource) {
        if (!_dataSource) {
            this.dataSource = socketDataSource;
        } else {
            this.dataSource = _dataSource;
        }
    }

    on(key: string, fn: <T>(...args: T[]) => void) {
        this.dataSource.on(key, fn);
    }

    emit<T>(key: string, ...args: T[]) {
        this.dataSource.emit(key, ...args);
    }

    disconnect() {
        this.dataSource.disconnect();
    }

    connect() {
        this.dataSource.connect();
    }

    removeAllListeners(key: string) {
        this.dataSource.removeAllListeners(key);
    }

    onConnectSuccess(callback: () => void) {
        this.dataSource.onErrorConnection(callback);
    }

    onErrorConnection(callback: () => void) {
        this.dataSource.onReconnectSuccess(callback);
    }
}

export const socketRepository = new SocketRepositoryImpl();
