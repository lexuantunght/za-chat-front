import React from 'react';

const LoadingMask: React.FC<{ title?: string; className?: string }> = ({ title, className }) => {
    return (
        <div className={`za-loading-mask ${className ? className : ''}`}>
            <div className="za-spin"></div>
            {title && <div>{title}</div>}
        </div>
    );
};

export default LoadingMask;
