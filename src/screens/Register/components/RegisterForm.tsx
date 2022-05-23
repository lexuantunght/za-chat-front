import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import defaultAvatar from '../../../common/resources/default-avatar.png';
import InputText from '../../../common/components/InputText';
import AvatarUploader from '../../../common/components/AvatarUploader';
import Button from '../../../common/components/Button';
import SignupRequest from '../../../common/models/SignupRequest';

export interface RegisterFormValues extends SignupRequest {
    confirmPassword: string;
}

const RegisterForm: React.FC<{
    onSubmit: (values: RegisterFormValues, formikHelpers: FormikHelpers<RegisterFormValues>) => Promise<void> | void;
}> = ({ onSubmit }) => {
    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            name: '',
            phoneNumber: '',
            username: '',
            password: '',
            confirmPassword: '',
            avatar: undefined
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, 'Tên dài tối thiểu 2 ký tự')
                .max(50, 'Tên dài tối đa 50 ký tự')
                .required('Vui lòng nhập họ tên'),
            phoneNumber: Yup.string()
                .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
                .required('Vui lòng nhập số điện thoại'),
            username: Yup.string()
                .min(3, 'Tên tài khoản tối thiểu 3 ký tự')
                .max(50, 'Tên tài khoản tối đa 50 ký tự')
                .required('Vui lòng nhập tên tài khoản'),
            password: Yup.string()
                .min(6, 'Mật khẩu tối thiểu 6 ký tự')
                .max(50, 'Mật khẩu tối đa 50 ký tự')
                .required('Vui lòng nhập mật khẩu'),
            confirmPassword: Yup.string().test('passwords-match', 'Mật khẩu xác nhận không đúng', function (value) {
                return this.parent.password === value;
            })
        }),
        onSubmit
    });

    return (
        <form className="register-form" onSubmit={formik.handleSubmit}>
            <InputText
                type="text"
                id="name"
                name="name"
                placeholder="Họ tên"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                isError={Boolean(formik.touched.name && formik.errors.name)}
                errorText={formik.errors.name}
            />
            <InputText
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Số điện thoại"
                numberOnly
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                isError={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                errorText={formik.errors.phoneNumber}
            />
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
            <InputText
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                isError={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                errorText={formik.errors.confirmPassword}
            />
            <AvatarUploader
                id="avatar"
                name="avatar"
                className="register-avatar"
                defaultSrc={defaultAvatar}
                onChange={(file) => formik.setFieldValue('avatar', file)}
                disabled={formik.isSubmitting}
            />
            <Button type="submit" disabled={formik.isSubmitting || !formik.isValid} loading={formik.isSubmitting}>
                Đăng ký
            </Button>
        </form>
    );
};

export default RegisterForm;
