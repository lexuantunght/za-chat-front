import React from 'react';
import { Provider } from 'react-redux';
import { getState, dispatch } from '../../utils/state';
import store from '../../utils/state/redux/store';
import Alert from '../components/Alert';

const ErrorHandler: React.FC = () => {
    const isError = getState((state) => state.app.isError);
    const errorMsg = getState((state) => state.app.errorMsg);

    const onClose = () => {
        dispatch({ type: 'APP_IS_ERROR', data: false });
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
    // eslint-disable-next-line react/display-name
    return (props: P) => (
        <Provider store={store}>
            <ErrorHandler />
            <Component {...props} />
        </Provider>
    );
}

export default withRedux;
