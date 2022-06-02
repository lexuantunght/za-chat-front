import React from 'react';
import ReactDOM from 'react-dom';
import LoginScreen from '../presentation/Login';
import '../utils/i18n';

ReactDOM.render(
    <React.StrictMode>
        <LoginScreen />
    </React.StrictMode>,
    document.getElementById('root')
);
