import React from 'react';
import { useSelector } from 'react-redux';
import logoIcon from '../../common/resources/logo.png';
import Button from '../../common/components/Button';
import RegisterForm from './components/RegisterForm';
import Alert from '../../common/components/Alert';
import RegisterController from '../../controller/authentication/RegisterController';
import { navigate } from '../../utils/app/eventHandler';
import useMultilingual from '../../utils/multilingual';
import useController from '../../controller/hooks';

const RegisterScreen = () => {
    const { register, errorSelector, clearError } = useController(RegisterController);
    const error = useSelector(errorSelector);
    const { t } = useMultilingual();

    const onNavigateLogin = () => {
        navigate('login');
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
                isShow={Boolean(error)}
                onAccept={onNavigateLogin}
                onCancel={clearError}
            />
        </div>
    );
};

export default RegisterScreen;
