import React from 'react';
import ReactDOM from 'react-dom';
import withRedux from '../common/context/withRedux';
import AppScreen from '../presentation/App';
import '../utils/multilingual/i18n';

const App = withRedux(AppScreen);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
