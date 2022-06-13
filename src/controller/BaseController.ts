import { createDraftSafeSelector } from '@reduxjs/toolkit';
import AppError from '../common/types/AppError';
import { setError } from '../presentation/App/reducer';
import store, { RootState } from '../utils/redux/store';

class BaseController {
    protected dispatch;

    constructor() {
        this.dispatch = store.dispatch;
    }

    public getState = () => {
        return store.getState();
    };

    protected handleError = (err?: AppError) => {
        store.dispatch(setError(err));
    };

    public clearError = () => {
        store.dispatch(setError());
    };

    protected createSelector = <T>(selector: (state: RootState) => T) => {
        return createDraftSafeSelector(selector, (state) => state);
    };
}

export default BaseController;
