import axios from 'axios';
import createDispatch from '../../common/actions/createDispatch';
import DataResponse from '../../common/models/DataResponse';
import store from '../redux/store';

const defaultHeader = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (err: any) => {
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

export const getHelper = async (api: string, headers: Record<string, string> = defaultHeader) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
        headers['x-access-token'] = token;
    }
    const data = await axios
        .get(api, { headers, withCredentials: true })
        .then((response) => response.data);
    return data as DataResponse;
};

export const postHelper = async (
    api: string,
    body: Record<string, string> | FormData,
    headers: Record<string, string> = defaultHeader
) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
        headers['x-access-token'] = token;
    }
    const data = await axios
        .post(api, body, { headers, withCredentials: true })
        .then((response) => response.data)
        .catch(handleError);
    return data as DataResponse;
};

export const putHelper = async (
    api: string,
    body: Record<string, string> | FormData,
    headers: Record<string, string> = defaultHeader
) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
        headers['x-access-token'] = token;
    }
    const data = await axios
        .put(api, body, { headers, withCredentials: true })
        .then((response) => response.data)
        .catch(handleError);
    return data as DataResponse;
};

export const deleteHelper = async (
    api: string,
    headers: Record<string, string> = defaultHeader
) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
        headers['x-access-token'] = token;
    }
    const data = await axios
        .delete(api, { headers, withCredentials: true })
        .then((response) => response.data)
        .catch(handleError);
    return data as DataResponse;
};
