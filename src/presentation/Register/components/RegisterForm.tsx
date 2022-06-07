import React from 'react';
import defaultAvatar from '../../../common/resources/default-avatar.png';
import InputText from '../../../common/components/InputText';
import AvatarUploader from '../../../common/components/AvatarUploader';
import Button from '../../../common/components/Button';
import { RegisterData } from '../../../domain/model/RegisterData';
import { useForm } from '../../../utils/form/formContent';
import { useValidation } from '../../../utils/form/validation';
import { UserData } from '../../../domain/model/UserData';

interface RegisterFormProps {
    onSubmit: (data: RegisterData) => Promise<UserData>;
    t: CallableFunction;
}

const RegisterForm = ({ onSubmit, t }: RegisterFormProps) => {
    const validator = useValidation();
    const form = useForm<RegisterData>({
        initialValues: {
            name: '',
            phoneNumber: '',
            username: '',
            password: '',
            confirmPassword: '',
            avatar: undefined,
        },
        validationSchema: validator.object({
            name: validator
                .string()
                .min(2, t('minName', { value: 2 }))
                .max(50, t('maxName', { value: 50 }))
                .required(t('requiredName')),
            phoneNumber: validator
                .string()
                .matches(/^[0-9]{10}$/, t('invalidPhoneNumber'))
                .required(t('requiredPhoneNumber')),
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
            confirmPassword: validator
                .string()
                .test('passwords-match', t('incorrectConfirmPassword'), function (value) {
                    return this.parent.password === value;
                }),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            await onSubmit(values);
            setSubmitting(false);
        },
    });

    return (
        <form className="register-form" onSubmit={form.handleSubmit}>
            <InputText
                type="text"
                id="name"
                name="name"
                placeholder={t('fullName')}
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={form.isSubmitting}
                isError={Boolean(form.touched.name && form.errors.name)}
                errorText={form.errors.name}
            />
            <InputText
                id="phoneNumber"
                name="phoneNumber"
                placeholder={t('phoneNumber')}
                numberOnly
                value={form.values.phoneNumber}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={form.isSubmitting}
                isError={Boolean(form.touched.phoneNumber && form.errors.phoneNumber)}
                errorText={form.errors.phoneNumber}
            />
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
            <InputText
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t('confirmPassword')}
                value={form.values.confirmPassword}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={form.isSubmitting}
                isError={Boolean(form.touched.confirmPassword && form.errors.confirmPassword)}
                errorText={form.errors.confirmPassword}
            />
            <AvatarUploader
                id="avatar"
                name="avatar"
                className="register-avatar"
                defaultSrc={defaultAvatar}
                onChange={(file) => form.setFieldValue('avatar', file)}
                disabled={form.isSubmitting}
            />
            <Button
                type="submit"
                disabled={form.isSubmitting || !form.isValid}
                loading={form.isSubmitting}>
                {t('register')}
            </Button>
        </form>
    );
};

export default RegisterForm;
