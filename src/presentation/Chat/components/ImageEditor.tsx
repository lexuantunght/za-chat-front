import React from 'react';
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';

type ImageEditorProps = {
    imagePath?: string;
    imageName?: string;
    onCancel?: () => void;
    onAccept?: (dataURL?: string) => void;
};

const ImageEditor = ({ imagePath, imageName, onCancel, onAccept }: ImageEditorProps) => {
    return (
        <div className="chat-image-editor">
            <div className="chat-image-editor-wrapper">
                <FilerobotImageEditor
                    source={imagePath || ''}
                    defaultSavedImageName={imageName}
                    defaultSavedImageType="jpeg"
                    onSave={(editedImageObject) => {
                        onAccept?.(editedImageObject.imageBase64);
                    }}
                    onClose={onCancel}
                    previewPixelRatio={window.devicePixelRatio}
                    savingPixelRatio={4}
                    avoidChangesNotSavedAlertOnLeave={false}
                    closeAfterSave
                    annotationsCommon={{
                        fill: '#ff0000',
                    }}
                    Text={{ text: 'ZaChat...' }}
                    tabsIds={[
                        TABS.ADJUST,
                        TABS.FILTERS,
                        TABS.RESIZE,
                        TABS.FINETUNE,
                        TABS.ANNOTATE,
                        TABS.WATERMARK,
                    ]}
                    defaultTabId={TABS.ANNOTATE}
                    defaultToolId={TOOLS.TEXT}
                />
            </div>
        </div>
    );
};

export default ImageEditor;
