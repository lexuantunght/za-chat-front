import { AnyAction } from 'redux';
import { Conversation } from '../../domain/model/Conversation';

interface ChatState {
    selectedConversation?: Conversation;
    conversations?: Conversation[];
}

const defaultState: ChatState = {
    selectedConversation: undefined,
    conversations: [],
};

const chatReducer = (state = defaultState, action: AnyAction) => {
    switch (action.type) {
        case 'CHAT_SELECTED_CONVERSATION':
            return { ...state, selectedConversation: action.data };
        case 'CHAT_CONVERSATIONS':
            return { ...state, conversations: action.data };
        default:
            return state;
    }
};

export default chatReducer;
