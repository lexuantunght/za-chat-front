export default interface SocketDataSource {
    emit: <T>(key: string, ...args: T[]) => void;
    on: (key: string, fn: <T>(...args: T[]) => void) => void;
    removeAllListeners: (key: string) => void;
    connect(): void;
    disconnect(): void;
    onErrorConnection(callback: () => void): void;
    onReconnectSuccess(callback: () => void): void;
}
