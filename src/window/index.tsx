import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppScreen from '../presentation/App';
import '../utils/multilingual/i18n';
import store from '../utils/redux/store';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <AppScreen />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
