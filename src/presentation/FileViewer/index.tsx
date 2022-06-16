import React from 'react';
import Button from '../../common/components/Button';
import Icon from '../../common/components/Icon';
import Image from '../../common/components/Image';
import { addListener, removeAllListeners } from '../../utils/app/eventHandler';

const FileViewer = () => {
    const [url, setUrl] = React.useState<string | undefined>();
    const [rotation, setRotation] = React.useState(0);
    React.useEffect(() => {
        addListener('fileView', (event: Event, url: string) => {
            setUrl(url);
        });
        return () => {
            removeAllListeners('fileView');
        };
    }, []);

    return (
        <div className="file-viewer-container">
            {url && (
                <>
                    <Image
                        src={url}
                        className="file-viewer-image"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    />
                    <div className="file-viewer-buttons">
                        <Button variant="text">
                            <Icon name="download" />
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => setRotation((rotation) => rotation - 90)}>
                            <Icon name="rotate" />
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => setRotation((rotation) => rotation + 90)}>
                            <Icon name="rotate-clockwise" />
                        </Button>
                        <Button variant="text">
                            <Icon name="zoom-in" />
                        </Button>
                        <Button variant="text">
                            <Icon name="zoom-out" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FileViewer;
