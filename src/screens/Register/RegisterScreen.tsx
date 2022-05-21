import React from 'react';
import { ipcRenderer } from 'electron';
import { FormikHelpers } from 'formik';
import withQueryClient from '../../common/context/withQueryClient';
import Button from '../../common/components/Button';
import { useSignup } from '../../hooks/authentication';
import RegisterForm, { RegisterFormValues } from './components/RegisterForm';

const RegisterScreen: React.FC = () => {
    const { mutateAsync: signup } = useSignup();

    const onNavigateLogin = () => {
        ipcRenderer.send('navigation', 'login');
    };

    const onSubmitRegisterForm = async (
        values: RegisterFormValues,
        { setSubmitting }: FormikHelpers<RegisterFormValues>
    ) => {
        const response = await signup(values);
        setSubmitting(false);
    };

    return (
        <div className="register-container">
            <img className="register-logo" src="/resources/logo.png" alt="logo" />
            <h3>Đăng ký tài khoản</h3>
            <RegisterForm onSubmit={onSubmitRegisterForm} />
            <div className="register-login-link">
                <span>Đã có tài khoản?</span>
                <Button className="login-link" variant="text" onClick={onNavigateLogin}>
                    Đăng nhập
                </Button>
            </div>
        </div>
    );
};

export default withQueryClient(RegisterScreen);
