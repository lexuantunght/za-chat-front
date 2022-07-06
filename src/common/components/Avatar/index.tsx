import React from 'react';

type AvatarProps = {
    src?: string;
    name?: string;
    className?: string;
    style?: React.CSSProperties;
};

const Avatar = ({ src, name, className, style }: AvatarProps) => {
    if (!src) {
        return (
            <div
                className={'za-avatar ' + (className ? className : '')}
                style={{ ...style, backgroundColor: '#ddd' }}>
                {name?.substring(0, 2)}
            </div>
        );
    }
    return <img src={src} style={style} className={'za-avatar ' + (className ? className : '')} />;
};

export default Avatar;
