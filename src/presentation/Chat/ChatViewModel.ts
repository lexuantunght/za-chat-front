import React from 'react';
import { useConversations, useSelectedConversation, useUserData } from './actions';
import { Conversation } from '../../domain/model/Conversation';
import { Message } from '../../domain/model/Message';
import { GetConversations } from '../../domain/usecase/conversation/GetConversations';
import { SendMessage } from '../../domain/usecase/message/SendMessage';
import { GetContacts } from '../../domain/usecase/contact/GetContacts';
import { RequestFriend } from '../../domain/usecase/contact/RequestFriend';
import { RejectFriend } from '../../domain/usecase/contact/RejectFriend';
import { AcceptFriend } from '../../domain/usecase/contact/AcceptFriend';
import { CancelRequest } from '../../domain/usecase/contact/CancelRequest';
import { GetInvitations } from '../../domain/usecase/contact/GetInvitations';
import useMultilingual from '../../utils/multilingual';

const ChatViewModel = () => {
    const { conversations, setConversations } = useConversations();
    const { selectedConversation, setSelectedConversation } = useSelectedConversation();
    const { userData } = useUserData();
    const [isLoading, setIsLoading] = React.useState(false);
    const { t, language } = useMultilingual();

    const getConversationUseCase = new GetConversations();
    const sendMessageUseCase = new SendMessage();
    const getContactsUseCase = new GetContacts();
    const requestFriendUseCase = new RequestFriend();
    const rejectFriendUseCase = new RejectFriend();
    const acceptFriendUseCase = new AcceptFriend();
    const cancelRequestUseCase = new CancelRequest();
    const getInvitationsUseCase = new GetInvitations();

    const getConversations = async () => {
        setIsLoading(true);
        setConversations(await getConversationUseCase.invoke());
        setIsLoading(false);
    };

    const selectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const sendMessage = async (message: Message) => {
        await sendMessageUseCase.invoke(message);
    };

    const getContacts = async () => {
        await getContactsUseCase.invoke();
    };

    const requestFriend = async (userId: string) => {
        await requestFriendUseCase.invoke(userId);
    };

    const rejectFriend = async (userId: string) => {
        await rejectFriendUseCase.invoke(userId);
    };

    const acceptFriend = async (userId: string) => {
        await acceptFriendUseCase.invoke(userId);
    };

    const cancelRequest = async (userId: string) => {
        await cancelRequestUseCase.invoke(userId);
    };

    const getInvitations = async () => {
        await getInvitationsUseCase.invoke();
    };

    return {
        getConversations,
        conversations,
        userData,
        isLoading,
        selectConversation,
        selectedConversation,
        sendMessage,
        getContacts,
        requestFriend,
        rejectFriend,
        acceptFriend,
        cancelRequest,
        getInvitations,
        t,
        language,
    };
};

export default ChatViewModel;
