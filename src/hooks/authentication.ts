import { useMutation, useQuery } from 'react-query';
import _get from 'lodash-es/get';
import { ipcRenderer } from 'electron';
import LoginRequest from '../common/models/request/LoginRequest';
import UserData from '../common/models/UserData';
import * as appConfig from '../utils/config/appConfig';
import Network from '../utils/networking/Network';
import SignupRequest from '../common/models/request/SignupRequest';
import { useLocalStorage } from './storage';

export const useSignup = () => {
    return useMutation(async (data: SignupRequest) => {
        const formData = new FormData();
        Object.keys(data).forEach((field) => formData.append(field, _get(data, field)));
        const res = await Network.getInstance().postHelper(
            `${appConfig.baseUrl}/users/signup`,
            formData,
            {
                Accept: 'application/json',
            }
        );
        return res;
    });
};

export const useLogin = () => {
    return useMutation(async (loginData: LoginRequest) => {
        const res = await Network.getInstance().postHelper(
            `${appConfig.baseUrl}/users/signin`,
            loginData
        );
        if (res.status === 'success') {
            useLocalStorage().setItem('accessToken', res.data?.accessToken);
            useLocalStorage().setItem('userData', JSON.stringify(res.data));
            ipcRenderer.send('navigation', 'authLoader');
        }
        return res;
    });
};

export const useFetchCurrent = () => {
    return useQuery<UserData, Error>(
        ['user_data'],
        async () => {
            if (!useLocalStorage().getItem('accessToken')) {
                throw new Error('Unauthorization');
            }
            const res = await Network.getInstance().getHelper(`${appConfig.baseUrl}/users/current`);
            if (res.data) {
                useLocalStorage().setItem('userData', JSON.stringify(res.data));
            }
            return res.data;
        },
        {
            retry: false,
        }
    );
};

export const useLogout = () => {
    return (callback?: CallableFunction) => {
        useLocalStorage().removeItem('accessToken');
        useLocalStorage().removeItem('userData');
        callback?.();
    };
};

export const useUpdateProfile = () => {
    return useMutation(async (userData: UserData) => {
        const res = await Network.getInstance().putHelper(
            `${appConfig.baseUrl}/users/updateInfo`,
            userData
        );
        return res;
    });
};

export const useProfile = () => {
    const userData: UserData = JSON.parse(useLocalStorage().getItem('userData') || '');
    return userData;
};
