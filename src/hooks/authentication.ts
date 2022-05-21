import { useMutation, useQuery } from 'react-query';
import _get from 'lodash-es/get';
import Cookies from 'js-cookie';
import LoginRequest from '../common/models/LoginRequest';
import UserData from '../common/models/UserData';
import * as appConfig from '../utils/config/appConfig';
import * as AxiosHelper from '../utils/helpers/AxiosHelper';
import SignupRequest from '../common/models/SignupRequest';

export const useSignup = () => {
    return useMutation(async (data: SignupRequest) => {
        const formData = new FormData();
        Object.keys(data).forEach((field) => formData.append(field, _get(data, field)));
        const res = await AxiosHelper.postHelper(`${appConfig.baseUrl}/users/signup`, formData, {
            Accept: 'application/json'
        });
        return res;
    });
};

export const useLogin = () => {
    return useMutation(async (loginData: LoginRequest) => {
        const res = await AxiosHelper.postHelper(`${appConfig.baseUrl}/users/signin`, loginData);
        return res;
    });
};

export const useFetchCurrent = () => {
    return useQuery<UserData, Error>(['user_data'], async () => {
        const res = await AxiosHelper.getHelper(`${appConfig.baseUrl}/users/current`);
        return res.data;
    });
};

export const useLogout = () => {
    return (callback?: CallableFunction) => {
        Cookies.remove('x-access-token');
        callback?.();
    };
};

export const useUpdateProfile = () => {
    return useMutation(async (userData: UserData) => {
        const res = await AxiosHelper.putHelper(`${appConfig.baseUrl}/users/updateInfo`, userData);
        return res;
    });
};
