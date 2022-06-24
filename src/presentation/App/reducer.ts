import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _update from 'lodash-es/update';
import AppError from '../../common/types/AppError';
import { Message } from '../../domain/model/Message';
import { UserData } from '../../domain/model/UserData';

export type AppState = {
    error?: string;
    userData?: UserData;
    searchResult: {
        messages?: Message[];
        users?: UserData[];
    };
};

const defaultAppState: AppState = {
    error: undefined,
    userData: undefined,
    searchResult: {
        messages: undefined,
        users: undefined,
    },
};

const appSlice = createSlice({
    name: 'chat',
    initialState: defaultAppState,
    reducers: {
        setError: (state: AppState, action: PayloadAction<AppError | undefined>) => {
            state.error = action.payload?.response?.data?.message || action.payload?.message;
        },
        setUserData: (state: AppState, action: PayloadAction<UserData | undefined>) => {
            state.userData = action.payload;
        },
        setSearchContactsResult: (state: AppState, action: PayloadAction<UserData[]>) => {
            state.searchResult.users = action.payload;
        },
        clearSearchResult: (state: AppState) => {
            state.searchResult = defaultAppState.searchResult;
        },
        updateSearchUsersResult: (state: AppState, action: PayloadAction<UserData>) => {
            if (!state.searchResult.users) return;
            const index = state.searchResult.users.findIndex(
                (user) => user._id === action.payload._id
            );
            if (index >= 0) {
                _update(state.searchResult.users, `[${index}]`, () => action.payload);
            }
        },
    },
});

const appReducer = appSlice.reducer;

export const {
    setError,
    setUserData,
    setSearchContactsResult,
    clearSearchResult,
    updateSearchUsersResult,
} = appSlice.actions;

export default appReducer;
