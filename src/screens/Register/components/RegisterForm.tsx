import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import defaultAvatar from '../../../common/resources/default-avatar.png';
import InputText from '../../../common/components/InputText';
import AvatarUploader from '../../../common/components/AvatarUploader';
import Button from '../../../common/components/Button';
import SignupRequest from '../../../common/models/request/SignupRequest';

export interface RegisterFormValues extends SignupRequest {
    confirmPassword: string;
}

const RegisterForm: React.FC<{
    onSubmit: (
        values: RegisterFormValues,
        formikHelpers: FormikHelpers<RegisterFormValues>
    ) => Promise<void> | void;
}> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            name: '',
            phoneNumber: '',
            username: '',
            password: '',
            confirmPassword: '',
            avatar: undefined,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, t('minName', { value: 2 }))
                .max(50, t('maxName', { value: 50 }))
                .required(t('requiredName')),
            phoneNumber: Yup.string()
                .matches(/^[0-9]{10}$/, t('invalidPhoneNumber'))
                .required(t('requiredPhoneNumber')),
            username: Yup.string()
                .min(3, t('minUsername', { value: 3 }))
                .max(50, t('maxUsername', { value: 50 }))
                .required(t('requiredUsername')),
            password: Yup.string()
                .min(6, t('minPassword', { value: 6 }))
                .max(50, t('maxPassword', { value: 50 }))
                .required(t('requiredPassword')),
            confirmPassword: Yup.string().test(
                'passwords-match',
                t('incorrectConfirmPassword'),
                function (value) {
                    return this.parent.password === value;
                }
            ),
        }),
        onSubmit,
    });

    return (
        <form className="register-form" onSubmit={formik.handleSubmit}>
            <InputText
                type="text"
                id="name"
                name="name"
                placeholder={t('fullName')}
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
                placeholder={t('phoneNumber')}
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
            <InputText
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t('confirmPassword')}
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
            <Button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                loading={formik.isSubmitting}>
                {t('register')}
            </Button>
        </form>
    );
};

export default RegisterForm;
