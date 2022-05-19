import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading, children, className, ...rest }) => {
    return (
        <button {...rest} className={'za-component za-button' + (className ? ` ${className}` : '')}>
            {children}
        </button>
    );
};

export default Button;
