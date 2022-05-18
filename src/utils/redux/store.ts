import { createStore } from 'redux';
import reducer from './reducers/reducer';

const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>;

export type Dispatcher = typeof store.dispatch;

export default store;