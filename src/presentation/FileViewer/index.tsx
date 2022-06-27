import React from 'react';
import moment from 'moment';
import ImageViewer from '../../common/components/ImageViewer';
import { addListener, openSaveDialog, removeAllListeners } from '../../utils/app/eventHandler';
import { SenderViewerData } from '../Chat/components/ChatSection';
import useMultilingual from '../../utils/multilingual';
import Video from '../../common/components/Video';

const FileViewer = () => {
    const { t } = useMultilingual();
    const [data, setData] = React.useState<SenderViewerData | undefined>();

    React.useEffect(() => {
        addListener('fileView', (event: Event, data: SenderViewerData) => {
            setData(data);
        });

        return () => {
            removeAllListeners('fileView');
        };
    }, []);

    if (!data?.file.url) {
        return null;
    }

    return (
        <div className="file-viewer-container">
            {data.file.type?.startsWith('video/') ? (
                <Video
                    className="file-viewer-video"
                    url={data.file.url}
                    showControllers
                    showExtendButton={false}
                    isNative
                />
            ) : (
                <ImageViewer
                    image={{
                        url: data.file.url,
                    }}
                    title={`${data.from} ${t('sentAt')} ${moment(data.time).format(
                        'HH:mm, DD/MM/yyyy'
                    )}`}
                    onClickDownload={() => {
                        const name = data.file.url?.substring(data.file.url?.lastIndexOf('/'));
                        openSaveDialog({
                            url: data.file.url,
                            name: name,
                            type: name?.substring(name.lastIndexOf('.') + 1),
                        });
                    }}
                />
            )}
        </div>
    );
};

export default FileViewer;
