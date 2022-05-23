import React from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { ipcRenderer, safeStorage } from 'electron';
import * as Yup from 'yup';
import InputText from '../../common/components/InputText';
import Button from '../../common/components/Button';
import LoginRequest from '../../common/models/LoginRequest';
import { useLogin } from '../../hooks/authentication';
import withQueryClient from '../../common/context/withQueryClient';

const LoginScreen: React.FC = () => {
    const { mutateAsync: login } = useLogin();

    const onRegisterClick = () => {
        ipcRenderer.send('openRegister');
    };

    const openMainApp = () => {
        ipcRenderer.send('openApp');
    };

    const onLogin = async (value: LoginRequest, { setSubmitting }: FormikHelpers<LoginRequest>) => {
        const response = await login(value);
        setSubmitting(false);
        if (response.status === 'success') {
            //safeStorage.encryptString(response.data?.accessToken);
            openMainApp();
        }
    };

    const formik = useFormik<LoginRequest>({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Tên tài khoản tối thiểu 3 ký tự')
                .max(50, 'Tên tài khoản tối đa 50 ký tự')
                .required('Vui lòng nhập tên tài khoản'),
            password: Yup.string()
                .min(6, 'Mật khẩu tối thiểu 6 ký tự')
                .max(50, 'Mật khẩu tối đa 50 ký tự')
                .required('Vui lòng nhập mật khẩu')
        }),
        onSubmit: onLogin
    });
    return (
        <div className="login-container">
            <img className="login-logo" src="/resources/logo.png" alt="logo" />
            <h3>Đăng nhập</h3>
            <form className="login-form" onSubmit={formik.handleSubmit}>
                <InputText
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Tên tài khoản"
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
                    placeholder="Mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    isError={Boolean(formik.touched.password && formik.errors.password)}
                    errorText={formik.errors.password}
                />
                <Button type="submit" disabled={formik.isSubmitting || !formik.isValid} loading={formik.isSubmitting}>
                    Đăng nhập
                </Button>
            </form>
            <div className="login-signup-link">
                <span>Chưa có tài khoản?</span>
                <Button className="signup-link" variant="text" onClick={onRegisterClick} disabled={formik.isSubmitting}>
                    Đăng ký
                </Button>
            </div>
        </div>
    );
};

export default withQueryClient(LoginScreen);
