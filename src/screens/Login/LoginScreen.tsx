import React from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import InputText from '../../common/components/InputText';
import Button from '../../common/components/Button';
import logoIcon from '../../common/resources/logo.png';
import LoginRequest from '../../common/models/request/LoginRequest';
import { useLogin } from '../../hooks/authentication';
import withQueryClient from '../../common/context/withQueryClient';

const LoginScreen: React.FC = () => {
    const { t } = useTranslation();
    const { mutateAsync: login } = useLogin();

    const onRegisterClick = () => {
        ipcRenderer.send('navigation', 'register');
    };

    const onLogin = async (value: LoginRequest, { setSubmitting }: FormikHelpers<LoginRequest>) => {
        const response = await login(value);
        setSubmitting(false);
        if (response.status === 'success') {
            window.localStorage.setItem('accessToken', response.data?.accessToken);
            window.localStorage.setItem('userData', JSON.stringify(response.data));
            ipcRenderer.send('navigation', 'authLoader');
        }
    };

    const formik = useFormik<LoginRequest>({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, t('minUsername', { value: 3 }))
                .max(50, t('maxUsername', { value: 50 }))
                .required(t('requiredUsername')),
            password: Yup.string()
                .min(6, t('minPassword', { value: 6 }))
                .max(50, t('maxPassword', { value: 50 }))
                .required(t('requiredPassword')),
        }),
        onSubmit: onLogin,
    });

    return (
        <div className="login-container">
            <img className="login-logo" src={logoIcon} alt="logo" />
            <h3>{t('login')}</h3>
            <form className="login-form" onSubmit={formik.handleSubmit}>
                <InputText
                    type="text"
                    id="username"
                    name="username"
                    placeholder={t('username')}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    isError={Boolean(formik.touched.username && formik.errors.username)}
                    errorText={formik.errors.username}
                />
                <InputText
                    type="password"
                    id="password"
                    name="password"
                    placeholder={t('password')}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    isError={Boolean(formik.touched.password && formik.errors.password)}
                    errorText={formik.errors.password}
                />
                <Button
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    loading={formik.isSubmitting}>
                    {t('login')}
                </Button>
            </form>
            <div className="login-signup-link">
                <span>{t('noAccount')}</span>
                <Button
                    className="signup-link"
                    variant="text"
                    onClick={onRegisterClick}
                    disabled={formik.isSubmitting}>
                    {t('register')}
                </Button>
            </div>
        </div>
    );
};

export default withQueryClient(LoginScreen);
