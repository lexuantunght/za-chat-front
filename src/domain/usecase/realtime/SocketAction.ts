import { socketRepository } from '../../../data/repository/SocketRepositoryImpl';
import { SocketRepository } from '../../repository/SocketRepository';

export interface SocketActionUseCase {
    emit: <T>(key: string, ...args: T[]) => void;
    on: (key: string, fn: <T>(...args: T[]) => void) => void;
    removeAllListeners: (key: string) => void;
    connect(errorConnectionCb?: () => void, reConnectSuccessCb?: () => void): void;
    disconnect(): void;
}

export class SocketAction implements SocketActionUseCase {
    private socketRepo: SocketRepository;
    constructor() {
        this.socketRepo = socketRepository;
    }

    emit<T>(key: string, ...args: T[]) {
        this.socketRepo.emit(key, ...args);
    }

    on(key: string, fn: <T>(...args: T[]) => void) {
        this.socketRepo.on(key, fn);
    }

    removeAllListeners(key: string) {
        this.socketRepo.removeAllListeners(key);
    }

    connect(errorConnectionCb?: () => void, reConnectSuccessCb?: () => void) {
        this.socketRepo.connect();
        if (errorConnectionCb) {
            this.socketRepo.onErrorConnection(errorConnectionCb);
        }
        if (reConnectSuccessCb) {
            this.socketRepo.onConnectSuccess(reConnectSuccessCb);
        }
    }

    disconnect() {
        this.socketRepo.disconnect();
    }
}
