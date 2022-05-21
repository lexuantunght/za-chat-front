import React from 'react';
import Icon from '../Icon';

interface AvatarUploaderProps {
    className?: string;
    onChange?: (file?: File, localUrl?: string) => void;
    defaultSrc?: string;
    src?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
    className,
    onChange,
    defaultSrc,
    id,
    name,
    src,
    disabled
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = React.useState(src || defaultSrc);
    return (
        <div className={'za-avatar-uploader' + (className ? ` ${className}` : '')}>
            <img src={imageUrl} alt="avatar" />
            <input
                ref={inputRef}
                id={id}
                disabled={disabled}
                name={name}
                type="file"
                multiple={false}
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const reader = new FileReader();
                        reader.readAsDataURL(e.target.files[0]);

                        reader.onload = () => {
                            const urlResult = reader.result as string;
                            setImageUrl(urlResult);
                            onChange?.(e.target.files?.[0], urlResult);
                        };
                    }
                }}
            />
            <button
                type="button"
                className="za-avatar-button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}>
                <Icon name="plus" />
            </button>
        </div>
    );
};

export default AvatarUploader;
