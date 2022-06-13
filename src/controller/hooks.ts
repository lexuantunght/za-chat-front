import React from 'react';
import { observeStore, RootState } from '../utils/redux/store';

const controllers = new Map();

export const useController = <T>(constructor: new () => T, isNewInstance = false) => {
    let controller;
    if (isNewInstance) {
        controller = new constructor();
    } else {
        if (!controllers.get(constructor)) {
            controllers.set(constructor, new constructor());
        }
        controller = controllers.get(constructor);
    }

    const createSelector = controller.createSelector;
    const defaultLocalState = controller.getState();
    const useGetState = <S>(_selector: (state: RootState) => S) => {
        const selector = createSelector(_selector);
        const [state, setState] = React.useState<S>(selector(defaultLocalState));

        React.useEffect(() => {
            const unsubscribe = observeStore(selector, (state: S) => setState(state));
            return () => {
                unsubscribe();
            };
        }, []);

        return state;
    };

    return { useGetState, ...(controller as T) };
};

export default useController;
