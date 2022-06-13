import React from 'react';
import ReactDOM from 'react-dom';
import AppScreen from '../presentation/App';
import '../utils/multilingual/i18n';

ReactDOM.render(
    <React.StrictMode>
        <AppScreen />
    </React.StrictMode>,
    document.getElementById('root')
);
