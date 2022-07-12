import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation } from '../../domain/model/Conversation';
import { Message } from '../../domain/model/Message';
import _orderBy from 'lodash-es/orderBy';
import moment from 'moment';

export interface ChatState {
    selectedConversation?: Conversation;
    conversations: Conversation[];
    messages: Message[];
    totalMessages: number;
    isEndTopMsgList?: boolean;
    isEndBottomMsgList?: boolean;
    isLoading?: boolean;
    isOpenSearch?: boolean;
    searchMsgResult?: Message[];
    searchKeyword?: string[];
}

const defaultState: ChatState = {
    conversations: [],
    messages: [],
    isLoading: false,
    totalMessages: 0,
    isOpenSearch: false,
    isEndBottomMsgList: true,
    searchMsgResult: [],
    searchKeyword: [],
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
        setTotalMessages: (state: ChatState, action: PayloadAction<number>) => {
            state.totalMessages = action.payload;
        },
        updateStatusMessage: (state: ChatState, action: PayloadAction<Message>) => {
            state.messages[state.messages.length - 1].status = action.payload.status;
        },
        updateFilesMessage: (state: ChatState, action: PayloadAction<Message>) => {
            state.messages[state.messages.length - 1].files = action.payload.files;
        },
        updateNewMessageToConversation: (state: ChatState, action: PayloadAction<Message>) => {
            const indexOfItem = (state.conversations || []).findIndex(
                (item) => item._id === action.payload.toUid
            );
            if (indexOfItem >= 0) {
                state.conversations[indexOfItem].lastMessage = action.payload.content;
                state.conversations[indexOfItem].lastMessageType = action.payload.type;
                state.conversations[indexOfItem].lastMessageTime = action.payload.sendTime;
                state.conversations[indexOfItem].lastMessageStatus = action.payload.status;
                state.conversations[indexOfItem].lastMessageFromUid = action.payload.fromUid;
            }

            state.conversations = _orderBy(
                state.conversations,
                (conv) => moment(conv.lastMessageTime).toDate(),
                'desc'
            );
        },
        updateFriendStatus: (
            state: ChatState,
            action: PayloadAction<undefined | 'stranger' | 'friend' | 'requested' | 'waiting'>
        ) => {
            if (state.selectedConversation) {
                state.selectedConversation.user.relationshipStatus = action.payload;
            }
        },
        setIsOpenSearch: (state: ChatState, action: PayloadAction<boolean | undefined>) => {
            state.isOpenSearch = action.payload;
        },
        setSearchMsgResult: (state: ChatState, action: PayloadAction<Message[] | undefined>) => {
            state.searchMsgResult = action.payload;
        },
        setSearchKeyword: (state: ChatState, action: PayloadAction<string[] | undefined>) => {
            state.searchKeyword = action.payload;
        },
        setIsEndTopMsgList: (state: ChatState, action: PayloadAction<boolean | undefined>) => {
            state.isEndTopMsgList = action.payload;
        },
        setIsEndBottomMsgList: (state: ChatState, action: PayloadAction<boolean | undefined>) => {
            state.isEndBottomMsgList = action.payload;
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
    updateFilesMessage,
    updateNewMessageToConversation,
    updateFriendStatus,
    setTotalMessages,
    setIsEndTopMsgList,
    setIsEndBottomMsgList,
    setIsOpenSearch,
    setSearchMsgResult,
    setSearchKeyword,
} = chatSlice.actions;

export default chatReducer;
