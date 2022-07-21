import React from 'react';
import logoIcon from '../../common/resources/logo.png';
import Button from '../../common/components/Button';
import RegisterForm from './components/RegisterForm';
import Alert from '../../common/components/Alert';
import RegisterController from '../../controller/authentication/RegisterController';
import { navigate } from '../../utils/app/eventHandler';
import useMultilingual from '../../utils/multilingual';
import useController from '../../controller/hooks';
import Titlebar from '../App/components/Titlebar';

const RegisterScreen = () => {
    const { useGetState, register, clearError } = useController(RegisterController);
    const error = useGetState((state) => state.app.error);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const { t } = useMultilingual();

    const onNavigateLogin = () => {
        navigate('login');
    };

    return (
        <div>
            <Titlebar title={'ZaChat - ' + t('register')} />
            <div className="register-container custom-scroll">
                <img className="register-logo" src={logoIcon} alt="logo" />
                <h3>{t('registerAccount')}</h3>
                <RegisterForm
                    onSubmit={register}
                    t={t}
                    onRegistedSuccess={() => setIsSuccess(true)}
                />
                <div className="register-login-link">
                    <span>{t('hadAccount')}</span>
                    <Button className="login-link" variant="text" onClick={onNavigateLogin}>
                        {t('login')}
                    </Button>
                </div>
                <Alert
                    title={t('notification')}
                    content={t('registerSuccess')}
                    isShow={isSuccess}
                    onAccept={onNavigateLogin}
                    onCancel={() => setIsSuccess(false)}
                    severity="success"
                />
                <Alert
                    title={t('notification')}
                    content={error}
                    isShow={Boolean(error)}
                    onAccept={clearError}
                    severity="error"
                />
            </div>
        </div>
    );
};

export default RegisterScreen;
