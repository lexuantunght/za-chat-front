import { useQuery } from 'react-query';
import { ChatItem, Message } from '../screens/Chat/models';
import * as appConfig from '../utils/config/appConfig';
import * as AxiosHelper from '../utils/helpers/AxiosHelper';

export const useFetchConversations = () => {
    return useQuery<ChatItem[], Error>(['conversation_list'], async () => {
        const res = await AxiosHelper.getHelper(`${appConfig.baseUrl}/chat/conversations`);
        return res.data;
    });
};

export const useFetchMessages = (query?: Record<string, number | string>) => {
    return useQuery<Message[], Error>(
        ['messages_list', query],
        async () => {
            const queryParams: string[] = [];
            if (query) {
                Object.keys(query).forEach((queryKey) => {
                    queryParams.push(`${queryKey}=${query[queryKey]}`);
                });
            }
            const res = await AxiosHelper.getHelper(
                `${appConfig.baseUrl}/chat/messages?${queryParams.join('&')}`
            );
            return res.data;
        },
        {
            cacheTime: 0,
        }
    );
};
