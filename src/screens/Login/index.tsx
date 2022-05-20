import '../../styles/login.css';
import '../../common/components/styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import { ipcRenderer } from 'electron';
import InputText from '../../common/components/InputText';
import Button from '../../common/components/Button';

const LoginScreen: React.FC = () => {
    const onRegisterClick = () => {
        ipcRenderer.send('navigation', 'register');
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: () => {}
    });
    return (
        <div className="login-container">
            <img className="login-logo" src="/logo.png" alt="logo" />
            <h3>Đăng nhập</h3>
            <form className="login-form" onSubmit={formik.handleSubmit}>
                <InputText
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Tên tài khoản"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <InputText
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <Button type="submit" disabled={formik.isSubmitting || !formik.isValid} loading={formik.isSubmitting}>
                    Đăng nhập
                </Button>
            </form>
            <div className="login-signup-link">
                <span>Chưa có tài khoản?</span>
                <Button className="signup-link" variant="text" onClick={onRegisterClick}>
                    Đăng ký
                </Button>
            </div>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <LoginScreen />
    </React.StrictMode>,
    document.getElementById('root')
);
