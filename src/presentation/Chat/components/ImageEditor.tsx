import React from 'react';
import 'tui-image-editor/dist/tui-image-editor.css';
import Editor from '@toast-ui/react-image-editor';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';

type ImageEditorProps = {
    imagePath?: string;
    imageName?: string;
    acceptLabel?: string;
    cancelLabel?: string;
    onCancel?: () => void;
    onAccept?: (dataURL?: string) => void;
};

const ImageEditor = ({
    imagePath,
    imageName,
    onCancel,
    onAccept,
    acceptLabel = 'Done',
    cancelLabel = 'Cancel',
}: ImageEditorProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorRef = React.useRef<any>(null);
    return (
        <div className="chat-image-editor">
            <div className="chat-image-editor-wrapper">
                <Editor
                    ref={editorRef}
                    includeUI={{
                        menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'],
                        initMenu: 'draw',
                        menuBarPosition: 'top',
                        uiSize: {
                            width: '100%',
                            height: '100%',
                        },
                        loadImage:
                            imagePath && imageName
                                ? { path: imagePath, name: imageName }
                                : undefined,
                    }}
                    cssMaxHeight={400}
                    usageStatistics={false}
                    selectionStyle={{
                        cornerSize: 10,
                        rotatingPointOffset: 50,
                    }}
                />
            </div>
            <div className="chat-image-editor-buttons">
                <Button variant="outlined" onClick={onCancel}>
                    <Icon name="cancel" />
                    <span>{cancelLabel}</span>
                </Button>
                <Button
                    className="chat-image-editor-done"
                    onClick={() =>
                        onAccept?.(
                            editorRef.current
                                ?.getInstance()
                                .toDataURL({ format: 'jpeg', quality: 0.5 })
                        )
                    }>
                    <Icon name="check" />
                    <span>{acceptLabel}</span>
                </Button>
            </div>
        </div>
    );
};

export default ImageEditor;
