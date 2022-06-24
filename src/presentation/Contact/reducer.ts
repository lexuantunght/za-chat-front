import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Friend } from '../../domain/model/Friend';
import { FriendRequest } from '../../domain/model/FriendRequest';

export type ContactState = {
    friends: Friend[];
    friendRequests: FriendRequest[];
};

const defaultContactState: ContactState = {
    friends: [],
    friendRequests: [],
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
    },
});

const contactReducer = contactSlice.reducer;

export const { setFriends, setFriendRequests } = contactSlice.actions;

export default contactReducer;
