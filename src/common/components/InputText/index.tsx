import React from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
    errorText?: string;
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

const InputText: React.FC<InputTextProps> = ({ className, isError, errorText, ...rest }) => {
    return (
        <>
            <input {...rest} className={buildClassName({ className, isError })} />
            {isError && errorText && <small className="za-error-text">{errorText}</small>}
        </>
    );
};

export default InputText;
