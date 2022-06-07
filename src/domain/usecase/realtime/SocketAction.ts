import { SocketRepositoryImpl } from '../../../data/repository/SocketRepositoryImpl';
import { SocketRepository } from '../../repository/SocketRepository';

export interface SocketActionUseCase {
    emit: <T>(key: string, ...args: T[]) => void;
    on: (key: string, fn: <T>(...args: T[]) => void) => void;
    removeAllListeners: (key: string) => void;
    connect(): void;
    disconnect(): void;
}

export class SocketAction implements SocketActionUseCase {
    private socketRepo: SocketRepository;
    constructor(_socketRepo?: SocketRepository) {
        if (!_socketRepo) {
            this.socketRepo = new SocketRepositoryImpl();
        } else {
            this.socketRepo = _socketRepo;
        }
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

    connect() {
        this.socketRepo.connect();
    }

    disconnect() {
        this.socketRepo.disconnect();
    }
}
