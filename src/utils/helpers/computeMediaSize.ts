export default function computeMediaSize(
    originHeight?: number,
    originWidth?: number,
    maxHeight?: number,
    maxWidth?: number
) {
    if (!originHeight || !originWidth) {
        return null;
    }
    const ratio = originWidth / originHeight;
    if (maxHeight && !maxWidth) {
        const height = Math.min(maxHeight, originHeight);
        return { width: height * ratio, height };
    }
    if (maxWidth && !maxHeight) {
        const width = Math.min(maxWidth, originWidth);
        return { width, height: width / ratio };
    }
    if (maxHeight && maxWidth) {
        if (maxWidth / maxHeight > ratio) {
            const height = Math.min(maxHeight, originHeight);
            return { width: height * ratio, height };
        } else {
            const width = Math.min(maxWidth, originWidth);
            return { width, height: width / ratio };
        }
    }
    return { width: originWidth, height: originHeight };
}
