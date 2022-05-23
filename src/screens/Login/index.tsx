import React from 'react';
import ReactDOM from 'react-dom';
import withRedux from '../../common/context/withRedux';
import LoginScreen from './LoginScreen';

const Login = withRedux(LoginScreen);

ReactDOM.render(
    <React.StrictMode>
        <Login />
    </React.StrictMode>,
    document.getElementById('root')
);
