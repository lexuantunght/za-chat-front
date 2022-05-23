import React from 'react';
import ReactDOM from 'react-dom';
import withRedux from '../../common/context/withRedux';
import AuthLoader from './AuthLoader';

const Authentication = withRedux(AuthLoader);

ReactDOM.render(
    <React.StrictMode>
        <Authentication />
    </React.StrictMode>,
    document.getElementById('root')
);
