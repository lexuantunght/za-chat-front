import { configureStore, Selector, Store } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import reducer from './reducer';

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(logger),
    devTools: process.env.NODE_ENV === 'development',
});

export function observeStore<T>(
    selector: Selector<RootState, T>,
    onChange: (state: T) => void,
    st: Store = store
) {
    let currentState: T;
    function handleChange() {
        const nextState = selector(st.getState());
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    const unsubscribe = st.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}

export type RootState = ReturnType<typeof store.getState>;

export type Dispatcher = typeof store.dispatch;

export default store;
