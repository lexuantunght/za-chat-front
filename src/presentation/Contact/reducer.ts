import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _remove from 'lodash-es/remove';
import { Friend } from '../../domain/model/Friend';
import { FriendRequest } from '../../domain/model/FriendRequest';
import { UserData } from '../../domain/model/UserData';

export type ContactState = {
    friends: Friend[];
    friendRequests: FriendRequest[];
    suggestedContacts: UserData[];
    showFriendRequest?: boolean;
    showChatbox?: boolean | string;
};

const defaultContactState: ContactState = {
    friends: [],
    friendRequests: [],
    suggestedContacts: [],
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
        setSuggestedContacts: (state: ContactState, action: PayloadAction<UserData[]>) => {
            state.suggestedContacts = action.payload;
        },
        removeSuggestedContact: (state: ContactState, action: PayloadAction<UserData>) => {
            _remove(state.suggestedContacts, (contact) => contact._id === action.payload._id);
        },
    },
});

const contactReducer = contactSlice.reducer;

export const {
    setFriends,
    setFriendRequests,
    setSuggestedContacts,
    toggleFriendRequest,
    toggleChatbox,
    removeFriendRequest,
    appendFriend,
    removeSuggestedContact,
} = contactSlice.actions;

export default contactReducer;
