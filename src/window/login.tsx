import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import LoginScreen from '../presentation/Login';
import '../utils/multilingual/i18n';
import store from '../utils/redux/store';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <LoginScreen />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
