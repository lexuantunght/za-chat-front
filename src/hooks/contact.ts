import { useQuery, useMutation } from 'react-query';
import { Contact } from '../screens/Contact/models';
import * as appConfig from '../utils/config/appConfig';
import NetworkHelper from '../utils/helpers/NetworkHelper';

export const useFetchContacts = () => {
    return useQuery<Contact[], Error>(['contact_list'], async () => {
        const res = await NetworkHelper.getInstance().getHelper(`${appConfig.baseUrl}/contacts`);
        return res.data;
    });
};

export const useAddContact = () => {
    return useMutation(async (userId: string) => {
        const res = await NetworkHelper.getInstance().postHelper(
            `${appConfig.baseUrl}/contacts/add`,
            { userId }
        );
        return res;
    });
};

export const useFindContacts = (query: { keyword: string }) => {
    return useQuery<Contact[], Error>(['search_contact', query], async () => {
        if (!query.keyword) {
            return [];
        }
        const res = await NetworkHelper.getInstance().getHelper(
            `${appConfig.baseUrl}/contacts/find?keyword=${query.keyword}`
        );
        return res.data;
    });
};
