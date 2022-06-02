import { Conversation } from '../../domain/model/Conversation';
import { dispatch, getState } from '../../utils/state';

export const useConversations = () => {
    return {
        conversations: getState((state) => state.chat.conversations),
        setConversations: (data: Conversation[]) => dispatch({ type: 'CHAT_CONVERSATIONS', data }),
    };
};

export const useSelectedConversation = () => {
    return {
        selectedConversation: getState((state) => state.chat.selectedConversation),
        setSelectedConversation: (data: Conversation) =>
            dispatch({ type: 'CHAT_SELECTED_CONVERSATION', data }),
    };
};

export const useUserData = () => {
    return {
        userData: getState((state) => state.app.userData),
    };
};
