import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation } from '../../domain/model/Conversation';

interface ChatState {
    selectedConversation?: Conversation;
    conversations?: Conversation[];
    isLoading?: boolean;
}

const defaultState: ChatState = {
    conversations: [],
    isLoading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: defaultState,
    reducers: {
        selectConversation: (state: ChatState, action: PayloadAction<Conversation>) => {
            state.selectedConversation = action.payload;
        },
        setLoading: (state: ChatState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setConversations: (state: ChatState, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
    },
});

const chatReducer = chatSlice.reducer;

export const { selectConversation, setLoading, setConversations } = chatSlice.actions;

export default chatReducer;
