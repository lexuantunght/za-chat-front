import React from 'react';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import Image, { ImageRef } from '../../../common/components/Image';
import Modal from '../../../common/components/Modal';
import { FileData } from '../../../domain/model/FileData';
import { dataUrlToFile } from '../../../utils/helpers/dataUrlToFile';
import ImageEditor from './ImageEditor';
import fileHolder from '../../../common/resources/file-holder.png';

type PastedFileItemProps = {
    file: FileData;
    onRemove?: () => void;
    t: CallableFunction;
    onEdited?: (fileData: FileData) => void;
};

const PastedFileItem = ({ file, onRemove, t, onEdited }: PastedFileItemProps) => {
    const [showEditor, setShowEditor] = React.useState(false);
    const imageRef = React.useRef<ImageRef>(null);

    if (file.type?.startsWith('image/')) {
        return (
            <div className="chat-pasted-file-item">
                <Image ref={imageRef} src={file.url} />
                <Button variant="text" className="chat-pasted-cancel" onClick={onRemove}>
                    <Icon name="cancel" />
                </Button>
                <Button
                    variant="text"
                    className="chat-pasted-edit"
                    onClick={() => {
                        setShowEditor(true);
                    }}>
                    <Icon name="edit" />
                </Button>
                <Modal
                    title={t('imageEditor')}
                    isOpen={showEditor}
                    onClose={() => setShowEditor(false)}>
                    <ImageEditor
                        imageName={file.name}
                        imagePath={file.url}
                        onCancel={() => setShowEditor(false)}
                        onAccept={(url) => {
                            if (url && file.name) {
                                imageRef.current?.setSrc(url);
                                const edited = dataUrlToFile(url, file.name);
                                onEdited?.({ ...file, file: edited, url, type: edited?.type });
                            }
                            setShowEditor(false);
                        }}
                    />
                </Modal>
            </div>
        );
    }

    return (
        <div className="chat-pasted-file-item">
            <img src={fileHolder} className="file-placeholder" />
            <div className="file-placeholder-type">
                {file.name?.substring(file.name?.lastIndexOf('.') + 1).substring(0, 3)}
            </div>
            <div className="file-placeholder-name">
                <div>{file.name}</div>
            </div>
            <Button variant="text" className="chat-pasted-cancel" onClick={onRemove}>
                <Icon name="cancel" />
            </Button>
        </div>
    );
};

export default PastedFileItem;
