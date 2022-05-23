import React from 'react';
import { ipcRenderer } from 'electron';
import { FormikHelpers } from 'formik';
import logoIcon from '../../common/resources/logo.png';
import withQueryClient from '../../common/context/withQueryClient';
import Button from '../../common/components/Button';
import { useSignup } from '../../hooks/authentication';
import RegisterForm, { RegisterFormValues } from './components/RegisterForm';
import Alert from '../../common/components/Alert';

const RegisterScreen: React.FC = () => {
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
            <h3>Đăng ký tài khoản</h3>
            <RegisterForm onSubmit={onSubmitRegisterForm} />
            <div className="register-login-link">
                <span>Đã có tài khoản?</span>
                <Button className="login-link" variant="text" onClick={onNavigateLogin} disabled={isLoading}>
                    Đăng nhập
                </Button>
            </div>
            <Alert
                title="Thông báo"
                content="Đăng ký tài khoản thành công. Đăng nhập ngay?"
                isShow={showSuccessMsg}
                onAccept={onNavigateLogin}
                onCancel={() => setShowSuccessMsg(false)}
            />
        </div>
    );
};

export default withQueryClient(RegisterScreen);
