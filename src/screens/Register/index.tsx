import React from 'react';
import ReactDOM from 'react-dom';
import withRedux from '../../common/context/withRedux';
import RegisterScreen from './RegisterScreen';

const Register = withRedux(RegisterScreen);

ReactDOM.render(
    <React.StrictMode>
        <Register />
    </React.StrictMode>,
    document.getElementById('root')
);
