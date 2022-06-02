import React from 'react';
import ReactDOM from 'react-dom';
import RegisterScreen from '../presentation/Register';
import '../utils/i18n';

ReactDOM.render(
    <React.StrictMode>
        <RegisterScreen />
    </React.StrictMode>,
    document.getElementById('root')
);
