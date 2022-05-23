import React from 'react';
import ReactDOM from 'react-dom';
import LoginScreen from './LoginScreen';
import withRedux from '../../common/context/withRedux';

const Login = withRedux(LoginScreen);

ReactDOM.render(
    <React.StrictMode>
        <Login />
    </React.StrictMode>,
    document.getElementById('root')
);
