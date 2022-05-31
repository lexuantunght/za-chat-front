import axios from 'axios';
import createDispatch from '../../common/actions/createDispatch';
import DataResponse from '../../common/models/DataResponse';
import store from '../redux/store';

interface NetworkConfigs {
    headers: Record<string, string>;
    withCredentials?: boolean;
}

interface NetworkProvider {
    post: (
        url: string,
        data?: Record<string, string> | FormData,
        config?: NetworkConfigs
    ) => Promise<DataResponse>;
    get: (url: string, config?: NetworkConfigs) => Promise<DataResponse>;
    put: (
        url: string,
        data?: Record<string, string> | FormData,
        config?: NetworkConfigs
    ) => Promise<DataResponse>;
    delete: (url: string, config?: NetworkConfigs) => Promise<DataResponse>;
}

class NetworkHelper {
    private defaultHeader: Record<string, string>;
    private static instance: NetworkHelper | null = null;
    private token: string;
    private networkProvider;

    private constructor(networkProvider: NetworkProvider = axios) {
        this.networkProvider = networkProvider;
        this.token = window.localStorage.getItem('accessToken') || '';
        this.defaultHeader = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-access-token': this.token,
        };
    }

    public static getInstance = () => {
        if (this.instance === null) {
            this.instance = new NetworkHelper();
        }
        return this.instance;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handleError = (err: any) => {
        let errMsg;
        if (err.response) {
            errMsg = err.response.data.message;
        } else {
            errMsg = 'Đã xảy ra lỗi, vui lòng thử lại sau';
        }
        store.dispatch(createDispatch('app.errorMsg', errMsg));
        store.dispatch(createDispatch('app.isError', true));
        return {
            status: 'fail',
            message: errMsg,
        };
    };

    public getHelper = async (
        api: string,
        headers: Record<string, string> = this.defaultHeader
    ) => {
        const data = await this.networkProvider
            .get(api, { headers, withCredentials: true })
            .then((response) => response.data);
        return data as DataResponse;
    };

    public postHelper = async (
        api: string,
        body: Record<string, string> | FormData,
        headers: Record<string, string> = this.defaultHeader
    ) => {
        const data = await this.networkProvider
            .post(api, body, { headers, withCredentials: true })
            .then((response) => response.data)
            .catch(this.handleError);
        return data as DataResponse;
    };

    public putHelper = async (
        api: string,
        body: Record<string, string> | FormData,
        headers: Record<string, string> = this.defaultHeader
    ) => {
        const data = await this.networkProvider
            .put(api, body, { headers, withCredentials: true })
            .then((response) => response.data)
            .catch(this.handleError);
        return data as DataResponse;
    };

    public deleteHelper = async (
        api: string,
        headers: Record<string, string> = this.defaultHeader
    ) => {
        const data = await this.networkProvider
            .delete(api, { headers, withCredentials: true })
            .then((response) => response.data)
            .catch(this.handleError);
        return data as DataResponse;
    };
}

export default NetworkHelper;
