import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant?: 'text' | 'default';
}

const buildClassName = ({ variant, className }: ButtonProps) => {
    let defaultClass = 'za-component';
    switch (variant) {
        case 'text':
            defaultClass += ' za-button-text';
            break;
        default:
            defaultClass += ' za-button';
            break;
    }
    if (className) {
        defaultClass += ` ${className}`;
    }
    return defaultClass;
};

const Button: React.FC<ButtonProps> = ({ loading, children, className, variant = 'default', ...rest }) => {
    return (
        <button {...rest} className={buildClassName({ variant, className })}>
            {loading && <div className="za-spin"></div>}
            {children}
        </button>
    );
};

export default Button;
