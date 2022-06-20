import React from 'react';
import computeMediaSize from '../../../utils/helpers/computeMediaSize';
import errorImage from '../../resources/error-image.png';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    originWidth?: number;
    originHeight?: number;
    maxHeight?: number;
    maxWidth?: number;
}

const Image = ({
    fallbackSrc = errorImage,
    src,
    className,
    originHeight,
    originWidth,
    maxHeight,
    maxWidth,
    style,
    ...rest
}: ImageProps) => {
    const [isError, setIsError] = React.useState(false);
    const [currentSrc, setCurrentSrc] = React.useState(src);

    const size = React.useMemo(
        () => computeMediaSize(originHeight, originWidth, maxHeight, maxWidth),
        [maxWidth, maxHeight, originHeight, originWidth]
    );

    const handleError = () => {
        if (!isError) {
            setIsError(true);
            setCurrentSrc(fallbackSrc);
        }
    };

    return (
        <img
            {...rest}
            style={{
                ...style,
                height: 'auto',
                width: size?.width,
                aspectRatio: `${size?.width}/${size?.height}`,
            }}
            src={currentSrc}
            onError={handleError}
            className={className ? `za-image ${className}` : 'za-image'}
        />
    );
};

export default Image;
