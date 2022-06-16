import React from 'react';
import errorImage from '../../resources/error-image.png';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

const Image = ({ fallbackSrc = errorImage, src, className, ...rest }: ImageProps) => {
    const [isError, setIsError] = React.useState(false);
    const [currentSrc, setCurrentSrc] = React.useState(src);

    const handleError = () => {
        if (!isError) {
            setIsError(true);
            setCurrentSrc(fallbackSrc);
        }
    };

    return (
        <img
            {...rest}
            src={currentSrc}
            onError={handleError}
            className={className ? `za-image ${className}` : 'za-image'}
        />
    );
};

export default Image;
