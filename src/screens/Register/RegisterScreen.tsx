import React from 'react';
import { ipcRenderer } from 'electron';
import { FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import logoIcon from '../../common/resources/logo.png';
import withQueryClient from '../../common/context/withQueryClient';
import Button from '../../common/components/Button';
import { useSignup } from '../../hooks/authentication';
import RegisterForm, { RegisterFormValues } from './components/RegisterForm';
import Alert from '../../common/components/Alert';

const RegisterScreen: React.FC = () => {
    const { t } = useTranslation();
    const [showSuccessMsg, setShowSuccessMsg] = React.useState(false);
    const { mutateAsync: signup, isLoading } = useSignup();

    const onNavigateLogin = () => {
        ipcRenderer.send('navigation', 'login');
    };

    const onSubmitRegisterForm = async (
        values: RegisterFormValues,
        { setSubmitting }: FormikHelpers<RegisterFormValues>
    ) => {
        const response = await signup(values);
        setSubmitting(false);
        if (response.status === 'success') {
            setShowSuccessMsg(true);
        }
    };

    return (
        <div className="register-container">
            <img className="register-logo" src={logoIcon} alt="logo" />
            <h3>{t('registerAccount')}</h3>
            <RegisterForm onSubmit={onSubmitRegisterForm} />
            <div className="register-login-link">
                <span>{t('hadAccount')}</span>
                <Button
                    className="login-link"
                    variant="text"
                    onClick={onNavigateLogin}
                    disabled={isLoading}>
                    {t('login')}
                </Button>
            </div>
            <Alert
                title={t('notification')}
                content={t('registerSuccess')}
                isShow={showSuccessMsg}
                onAccept={onNavigateLogin}
                onCancel={() => setShowSuccessMsg(false)}
            />
        </div>
    );
};

export default withQueryClient(RegisterScreen);
