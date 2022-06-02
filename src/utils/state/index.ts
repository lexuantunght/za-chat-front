import { useSelector } from 'react-redux';
import store, { RootState } from './redux/store';

export function getState<T>(getFunc: (state: RootState) => T, provider = useSelector) {
    return provider(getFunc);
}

export const dispatch = store.dispatch;
