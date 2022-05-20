import React from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputText: React.FC<InputTextProps> = ({ className, ...rest }) => {
    return <input {...rest} className={`za-component za-inputtext` + (className ? ` ${className}` : '')} />;
};

export default InputText;
