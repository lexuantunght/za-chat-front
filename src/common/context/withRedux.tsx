import React from 'react';
import { Provider, useSelector } from 'react-redux';
import store from '../../utils/redux/store';
import createDispatch from '../actions/createDispatch';
import createSelector from '../actions/createSelector';
import Alert from '../components/Alert';

const ErrorHandler: React.FC = () => {
    const isError = useSelector(createSelector('app.isError'));
    const errorMsg = useSelector(createSelector('app.errorMsg'));

    const onClose = () => {
        store.dispatch(createDispatch('app.isError', false));
    };

    return (
        <Alert
            title="Lỗi"
            acceptText="Đã hiểu"
            content={errorMsg}
            isShow={isError}
            onAccept={onClose}
            onClose={onClose}
            className="error-alert"
        />
    );
};

function withRedux<P>(Component: React.ComponentType<P>) {
    return (props: P) => (
        <Provider store={store}>
            <ErrorHandler />
            <Component {...props} />
        </Provider>
    );
}

export default withRedux;
