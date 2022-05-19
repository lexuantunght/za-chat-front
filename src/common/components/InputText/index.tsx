import React from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputText: React.FC<InputTextProps> = ({ className, style, ...rest }) => {
    return (
        <div className={`za-component za-inputtext` + (className ? ` ${className}` : '')} style={style}>
            <input {...rest} />
        </div>
    );
};

export default InputText;
