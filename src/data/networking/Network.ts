import axios from 'axios';

interface DataResponse<T> {
    status: 'success' | 'fail';
    data: T;
    message?: string;
}

interface NetworkConfigs {
    headers: Record<string, string>;
    withCredentials?: boolean;
}

interface NetworkProvider {
    post<T>(
        url: string,
        data?: Record<string, string> | FormData,
        config?: NetworkConfigs
    ): Promise<DataResponse<T>>;
    get<T>(url: string, config?: NetworkConfigs): Promise<DataResponse<T>>;
    put<T, R>(
        url: string,
        data?: Record<string, R> | FormData,
        config?: NetworkConfigs
    ): Promise<DataResponse<T>>;
    delete<T>(url: string, config?: NetworkConfigs): Promise<DataResponse<T>>;
}

class Network {
    private defaultHeader: Record<string, string>;
    private static instance: Network | null = null;
    private networkProvider;
    private isErrorConnection: boolean;

    private constructor(networkProvider: NetworkProvider = axios) {
        this.networkProvider = networkProvider;
        this.defaultHeader = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        this.isErrorConnection = false;
    }

    public static getInstance = () => {
        if (this.instance === null) {
            this.instance = new Network();
        }
        return this.instance;
    };

    public getIsErrorConnection = () => {
        return this.isErrorConnection;
    };

    public setIsErrorConnection = (isError: boolean) => {
        this.isErrorConnection = isError;
    };

    public async getHelper<T>(api: string, headers: Record<string, string> = this.defaultHeader) {
        const data = await this.networkProvider
            .get(api, { headers, withCredentials: true })
            .then((response) => response.data);
        return data as DataResponse<T>;
    }

    public async postHelper<T>(
        api: string,
        body: Record<string, string> | FormData,
        headers: Record<string, string> = this.defaultHeader
    ) {
        const data = await this.networkProvider
            .post(api, body, { headers, withCredentials: true })
            .then((response) => response.data);
        return data as DataResponse<T>;
    }

    public async putHelper<T, R>(
        api: string,
        body: Record<string, R> | FormData,
        headers: Record<string, string> = this.defaultHeader
    ) {
        const data = await this.networkProvider
            .put(api, body, { headers, withCredentials: true })
            .then((response) => response.data);
        return data as DataResponse<T>;
    }

    public async deleteHelper<T>(
        api: string,
        headers: Record<string, string> = this.defaultHeader
    ) {
        const data = await this.networkProvider
            .delete(api, { headers, withCredentials: true })
            .then((response) => response.data);
        return data as DataResponse<T>;
    }
}

export default Network;
