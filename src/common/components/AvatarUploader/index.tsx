import React from 'react';

interface AvatarUploaderProps {
    className?: string;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ className }) => {
    const [imageUrl, setImageUrl] = React.useState('/resources/default-avatar.png');
    return (
        <div className={'za-avatar-uploader' + (className ? ` ${className}` : '')}>
            <img src={imageUrl} alt="avatar" />
            <input type="file" multiple={false} accept="image/png, image/jpg, image/jpeg" />
        </div>
    );
};

export default AvatarUploader;
