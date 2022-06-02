import React from 'react';
import { ipcRenderer } from 'electron';
import logoIcon from '../../common/resources/logo.png';
import Button from '../../common/components/Button';
import RegisterForm from './components/RegisterForm';
import useRegisterViewModel from './RegisterViewModel';
import Alert from '../../common/components/Alert';

const RegisterScreen = () => {
    const { register, isShowSuccessMsg, hideSuccessMsg, t } = useRegisterViewModel();

    const onNavigateLogin = () => {
        ipcRenderer.send('navigation', 'login');
    };

    return (
        <div className="register-container">
            <img className="register-logo" src={logoIcon} alt="logo" />
            <h3>{t('registerAccount')}</h3>
            <RegisterForm onSubmit={register} t={t} />
            <div className="register-login-link">
                <span>{t('hadAccount')}</span>
                <Button className="login-link" variant="text" onClick={onNavigateLogin}>
                    {t('login')}
                </Button>
            </div>
            <Alert
                title={t('notification')}
                content={t('registerSuccess')}
                isShow={isShowSuccessMsg}
                onAccept={onNavigateLogin}
                onCancel={hideSuccessMsg}
            />
        </div>
    );
};

export default RegisterScreen;
