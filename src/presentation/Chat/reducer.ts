import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation } from '../../domain/model/Conversation';
import { Message } from '../../domain/model/Message';
import _update from 'lodash-es/update';
import { FriendStatus } from '../../common/types/FriendStatus';

interface ChatState {
    selectedConversation?: Conversation;
    conversations: Conversation[];
    messages: Message[];
    isLoading?: boolean;
}

const defaultState: ChatState = {
    conversations: [],
    messages: [],
    isLoading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: defaultState,
    reducers: {
        selectConversation: (state: ChatState, action: PayloadAction<Conversation | undefined>) => {
            state.selectedConversation = action.payload;
        },
        setLoading: (state: ChatState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setConversations: (state: ChatState, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setMessages: (state: ChatState, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        updateStatusMessage: (state: ChatState, action: PayloadAction<Message>) => {
            _update(state.messages, '[0].status', () => action.payload.status);
        },
        updateNewMessageToConversation: (state: ChatState, action: PayloadAction<Message>) => {
            const indexOfItem = (state.conversations || []).findIndex(
                (item) => item._id === action.payload.conversationId
            );
            _update(state.conversations, `[${indexOfItem}].latestMessage`, () => action.payload);
        },
        updateFriendStatus: (state: ChatState, action: PayloadAction<FriendStatus>) => {
            if (state.selectedConversation) {
                state.selectedConversation.friendStatus = action.payload;
            }
        },
    },
});

const chatReducer = chatSlice.reducer;

export const {
    selectConversation,
    setLoading,
    setConversations,
    setMessages,
    updateStatusMessage,
    updateNewMessageToConversation,
    updateFriendStatus,
} = chatSlice.actions;

export default chatReducer;
