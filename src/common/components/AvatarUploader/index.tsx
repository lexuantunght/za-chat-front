import React from 'react';
import Icon from '../Icon';

interface AvatarUploaderProps {
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    defaultSrc?: string;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ className, onChange, defaultSrc }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = React.useState(defaultSrc);
    return (
        <div
            className={'za-avatar-uploader' + (className ? ` ${className}` : '')}
            onClick={() => inputRef.current?.click()}>
            <img src={imageUrl} alt="avatar" />
            <input
                ref={inputRef}
                type="file"
                multiple={false}
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const reader = new FileReader();
                        reader.readAsDataURL(e.target.files[0]);
                        reader.onload = () => {
                            setImageUrl(reader.result as string);
                            onChange?.(e);
                        };
                    }
                }}
            />
            <div className="za-avatar-button">
                <Icon name="plus" />
            </div>
        </div>
    );
};

export default AvatarUploader;
