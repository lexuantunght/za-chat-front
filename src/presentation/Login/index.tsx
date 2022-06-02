import React from 'react';
import { ipcRenderer } from 'electron';
import InputText from '../../common/components/InputText';
import Button from '../../common/components/Button';
import logoIcon from '../../common/resources/logo.png';
import useLoginViewModel from './LoginViewModel';
import { useForm } from '../../utils/form/formContent';
import { LoginData } from '../../domain/model/LoginData';
import { useValidation } from '../../utils/form/validation';

const LoginScreen = () => {
    const { login, t } = useLoginViewModel();
    const validator = useValidation();

    const onRegisterClick = () => {
        ipcRenderer.send('navigation', 'register');
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
        onSubmit: (values) => {
            login(values);
        },
    });

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
                    disabled={form.isSubmitting}
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
                    disabled={form.isSubmitting}
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
            <div className="login-signup-link">
                <span>{t('noAccount')}</span>
                <Button
                    className="signup-link"
                    variant="text"
                    onClick={onRegisterClick}
                    disabled={form.isSubmitting}>
                    {t('register')}
                </Button>
            </div>
        </div>
    );
};

export default LoginScreen;
