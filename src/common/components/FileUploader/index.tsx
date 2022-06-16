import React from 'react';
import Divider from '../Divider';
import Icon from '../Icon';
import Modal from '../Modal';

type FileUploaderProps = {
    open?: boolean;
    title?: string;
    selectTitle?: string;
    uploadingTitle?: string;
    onClose?: () => void;
    accept?: string;
};

const FileUploader = ({
    open,
    title = 'File Uploader',
    selectTitle = 'Select or drag files here',
    uploadingTitle = 'Uploading',
    accept = 'image/*',
    onClose,
}: FileUploaderProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <Modal isOpen={open} onClose={onClose} title={title}>
            <Divider />
            <div className="za-uploader-container">
                <div className="za-uploader-drop" onClick={() => inputRef.current?.click()}>
                    <Icon name="upload" />
                    <div>{selectTitle}</div>
                </div>
                <div className="za-uploader-result">
                    <div className="za-uploader-result-title">{uploadingTitle}</div>
                </div>
            </div>
            <input type="file" ref={inputRef} accept={accept} hidden />
        </Modal>
    );
};

export default FileUploader;
