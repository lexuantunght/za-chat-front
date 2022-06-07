import { SocketRepository } from '../../domain/repository/SocketRepository';
import SocketAPIDataSourceImpl from '../dataSource/API/SocketAPIDataSource';
import SocketDataSource from '../dataSource/SocketDataSource';

export class SocketRepositoryImpl implements SocketRepository {
    dataSource: SocketDataSource;
    constructor(_dataSource?: SocketDataSource) {
        if (!_dataSource) {
            this.dataSource = new SocketAPIDataSourceImpl();
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
}
