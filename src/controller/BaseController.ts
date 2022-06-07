import { createDraftSafeSelector } from '@reduxjs/toolkit';
import AppError from '../common/types/AppError';
import { setError } from '../utils/redux/reducer';
import store, { RootState } from '../utils/redux/store';

class BaseController {
    protected dispatch;

    constructor() {
        this.dispatch = store.dispatch;
    }

    protected getState = () => {
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

    public errorSelector = this.createSelector((state) => state.app.error);

    public userDataSelector = this.createSelector((state) => state.app.userData);
}

export default BaseController;
