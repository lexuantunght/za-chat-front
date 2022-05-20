import { useMutation, useQuery } from 'react-query';
import Cookies from 'js-cookie';
import LoginRequest from '../common/models/LoginRequest';
import UserData from '../common/models/UserData';
import appConfig from '../utils/config/appConfig';
import * as AxiosHelper from '../utils/helpers/AxiosHelper';

export const useLogin = () => {
    return useMutation(async ({ username, password }: LoginRequest) => {
        const res = await AxiosHelper.postHelper(`${appConfig.baseUrl}/users/signin`, {
            username,
            password
        });
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
        const res = await AxiosHelper.putHelper(`${appConfig.baseUrl}/users/update`, userData);
        return res;
    });
};
