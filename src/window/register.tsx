import React from 'react';
import ReactDOM from 'react-dom';
import RegisterScreen from '../presentation/Register';
import '../utils/multilingual/i18n';

ReactDOM.render(
    <React.StrictMode>
        <RegisterScreen />
    </React.StrictMode>,
    document.getElementById('root')
);
