import React from 'react';
import { Provider, useSelector } from 'react-redux';
import store from '../../utils/redux/store';
import createSelector from '../actions/createSelector';
import Modal from '../components/Modal';

const ErrorHandler: React.FC = () => {
    const isError = useSelector(createSelector('app.isError'));
    React.useEffect(() => {
        if (isError) {
        }
    }, [isError]);
    return <Modal />;
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
