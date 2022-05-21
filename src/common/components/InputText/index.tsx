import React from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
    errorText?: string;
    numberOnly?: boolean;
}

const buildClassName = ({ className, isError }: InputTextProps) => {
    let defaultClass = 'za-component za-inputtext';
    if (className) {
        defaultClass += ` ${className}`;
    }
    if (isError) {
        defaultClass += ' za-inputtext-error';
    }
    return defaultClass;
};

const InputText: React.FC<InputTextProps> = ({ className, isError, errorText, onChange, numberOnly, ...rest }) => {
    const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!numberOnly) {
            onChange?.(e);
            return;
        }
        const regex = /^[0-9\b]+$/;
        if (e.target.value === '' || regex.test(e.target.value)) {
            onChange?.(e);
        }
    };
    return (
        <>
            <input {...rest} className={buildClassName({ className, isError })} onChange={onChangeText} />
            {isError && errorText && <small className="za-error-text">{errorText}</small>}
        </>
    );
};

export default InputText;
