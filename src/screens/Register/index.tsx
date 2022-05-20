import '../../styles/register.css';
import '../../common/components/styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import InputText from '../../common/components/InputText';
import AvatarUploader from '../../common/components/AvatarUploader';
import Button from '../../common/components/Button';

const RegisterScreen: React.FC = () => {
    const onNavigateLogin = () => {
        ipcRenderer.send('navigation', 'login');
    };
    return (
        <div className="register-container">
            <img className="register-logo" src="/logo.png" alt="logo" />
            <h3>Đăng ký tài khoản</h3>
            <form className="register-form">
                <InputText type="text" placeholder="Họ tên" />
                <InputText type="tel" placeholder="Số điện thoại" />
                <InputText type="text" placeholder="Tên tài khoản" />
                <InputText type="password" placeholder="Mật khẩu" />
                <InputText type="password" placeholder="Xác nhận mật khẩu" />
                <AvatarUploader className="register-avatar" defaultSrc="/resources/default-avatar.png" />
                <Button type="submit">Đăng ký</Button>
            </form>
            <div className="register-login-link">
                <span>Đã có tài khoản?</span>
                <Button className="login-link" variant="text" onClick={onNavigateLogin}>
                    Đăng nhập
                </Button>
            </div>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <RegisterScreen />
    </React.StrictMode>,
    document.getElementById('root')
);
