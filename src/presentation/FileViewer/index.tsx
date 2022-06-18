import React from 'react';
import ImageViewer from '../../common/components/ImageViewer';
import { addListener, removeAllListeners } from '../../utils/app/eventHandler';

const FileViewer = () => {
    const [url, setUrl] = React.useState<string | undefined>();

    React.useEffect(() => {
        addListener('fileView', (event: Event, url: string) => {
            setUrl(url);
        });

        return () => {
            removeAllListeners('fileView');
        };
    }, []);

    return <div className="file-viewer-container">{url && <ImageViewer images={[{ url }]} />}</div>;
};

export default FileViewer;
