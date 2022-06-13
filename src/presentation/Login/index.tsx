import React from 'react';
import InputText from '../../common/components/InputText';
import Alert from '../../common/components/Alert';
import Button from '../../common/components/Button';
import logoIcon from '../../common/resources/logo.png';
import { useForm } from '../../utils/form/formContent';
import { LoginData } from '../../domain/model/LoginData';
import { useValidation } from '../../utils/form/validation';
import useMultilingual from '../../utils/multilingual';
import { navigate, openMainApp } from '../../utils/app/eventHandler';
import useController from '../../controller/hooks';
import LoginController from '../../controller/authentication/LoginController';
import LoadingMask from '../../common/components/LoadingMask';

const LoginScreen = () => {
    const { useGetState, login, authorize, clearError } = useController(LoginController);
    const isLoading = useGetState((state) => state.login.isLoading);
    const error = useGetState((state) => state.app.error);
    const { t } = useMultilingual();
    const validator = useValidation();

    const onRegisterClick = () => {
        navigate('register');
    };

    const form = useForm<LoginData>({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validator.object({
            username: validator
                .string()
                .min(3, t('minUsername', { value: 3 }))
                .max(50, t('maxUsername', { value: 50 }))
                .required(t('requiredUsername')),
            password: validator
                .string()
                .min(6, t('minPassword', { value: 6 }))
                .max(50, t('maxPassword', { value: 50 }))
                .required(t('requiredPassword')),
        }),
        onSubmit: (values, { setSubmitting }) => {
            login(values, openMainApp, () => setSubmitting(false));
        },
    });

    React.useEffect(() => {
        authorize(openMainApp);
    }, []);

    if (isLoading) {
        return <LoadingMask className="login-auth-loading" title={t('authenticating')} />;
    }

    return (
        <div className="login-container">
            <img className="login-logo" src={logoIcon} alt="logo" />
            <h3>{t('login')}</h3>
            <form className="login-form" onSubmit={form.handleSubmit}>
                <InputText
                    type="text"
                    id="username"
                    name="username"
                    placeholder={t('username')}
                    value={form.values.username}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    isError={Boolean(form.touched.username && form.errors.username)}
                    errorText={form.errors.username}
                />
                <InputText
                    type="password"
                    id="password"
                    name="password"
                    placeholder={t('password')}
                    value={form.values.password}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    isError={Boolean(form.touched.password && form.errors.password)}
                    errorText={form.errors.password}
                />
                <Button
                    type="submit"
                    disabled={form.isSubmitting || !form.isValid}
                    loading={form.isSubmitting}>
                    {t('login')}
                </Button>
            </form>
            <div className="login-register-link">
                <span>{t('noAccount')}</span>
                <Button
                    className="register-link"
                    variant="text"
                    onClick={onRegisterClick}
                    disabled={form.isSubmitting}>
                    {t('register')}
                </Button>
            </div>
            <Alert
                title={t('notification')}
                content={error}
                isShow={Boolean(error)}
                onAccept={clearError}
                onClose={clearError}
            />
        </div>
    );
};

export default LoginScreen;
