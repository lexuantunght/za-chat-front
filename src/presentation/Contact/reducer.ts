import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Friend } from '../../domain/model/Friend';
import { FriendRequest } from '../../domain/model/FriendRequest';

export type ContactState = {
    friends: Friend[];
    friendRequests: FriendRequest[];
    showFriendRequest?: boolean;
    showChatbox?: boolean | string;
};

const defaultContactState: ContactState = {
    friends: [],
    friendRequests: [],
    showFriendRequest: true,
    showChatbox: false,
};

const contactSlice = createSlice({
    name: 'contact',
    initialState: defaultContactState,
    reducers: {
        setFriends: (state: ContactState, action: PayloadAction<Friend[]>) => {
            state.friends = action.payload;
        },
        setFriendRequests: (state: ContactState, action: PayloadAction<FriendRequest[]>) => {
            state.friendRequests = action.payload;
        },
        toggleFriendRequest: (state: ContactState, action: PayloadAction<boolean | undefined>) => {
            state.showFriendRequest = action.payload;
            state.showChatbox = !action.payload;
        },
        toggleChatbox: (
            state: ContactState,
            action: PayloadAction<boolean | string | undefined>
        ) => {
            state.showChatbox = action.payload;
            state.showFriendRequest = !action.payload;
        },
        removeFriendRequest: (state: ContactState, action: PayloadAction<string>) => {
            state.friendRequests.splice(
                state.friendRequests.findIndex((request) => request.fromUid === action.payload),
                1
            );
        },
        appendFriend: (state: ContactState, action: PayloadAction<Friend>) => {
            state.friends.unshift(action.payload);
        },
    },
});

const contactReducer = contactSlice.reducer;

export const {
    setFriends,
    setFriendRequests,
    toggleFriendRequest,
    toggleChatbox,
    removeFriendRequest,
    appendFriend,
} = contactSlice.actions;

export default contactReducer;
