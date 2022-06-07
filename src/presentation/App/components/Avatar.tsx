import React from 'react';
import defaultAvatar from '../../../common/resources/default-avatar.png';

interface AvatarProps {
    url?: string | null;
}

const Avatar = ({ url }: AvatarProps) => {
    return <img className="app-sidebar-avatar" src={url || defaultAvatar} />;
};

export default Avatar;
