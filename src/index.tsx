import React from 'react';
import ReactDOM from 'react-dom';
import withRedux from './common/context/withRedux';
import App from './screens/App';

const MainApp = withRedux(App);

ReactDOM.render(
    <React.StrictMode>
        <MainApp />
    </React.StrictMode>,
    document.getElementById('root')
);
