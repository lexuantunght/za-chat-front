import React from 'react';
import ReactDOM from 'react-dom';
import withRedux from '../common/context/withRedux';
import AppScreen from '../screens/App';
import '../utils/i18n';

const App = withRedux(AppScreen);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
