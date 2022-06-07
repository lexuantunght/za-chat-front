import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
    isLoading?: boolean;
}

const defaultState: LoginState = {
    isLoading: false,
};

const loginSlice = createSlice({
    name: 'login',
    initialState: defaultState,
    reducers: {
        setLoading: (state: LoginState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

const loginReducer = loginSlice.reducer;

export const { setLoading } = loginSlice.actions;

export default loginReducer;
