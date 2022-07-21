import React from 'react';
import { FiSend, FiImage } from 'react-icons/fi';
import { ImAttachment } from 'react-icons/im';
import { useValidation } from '../../../utils/form/validation';
import Button from '../../../common/components/Button';
import MessageInput from './MessageInput';
import { useForm } from '../../../utils/form/formContent';
import useController from '../../../controller/hooks';
import AppController from '../../../controller/AppController';
import { FileData } from '../../../domain/model/FileData';
import PastedFileItem from './PastedFileItem';

type ChatTypingProps = {
    onSend?: (content: string, files: FileData[]) => void;
    conversationId: string;
    userId: string;
    t: CallableFunction;
};

const ChatTyping = ({ onSend, conversationId, userId, t }: ChatTypingProps) => {
    const validator = useValidation();
    const { emitSocket, addSocketListener, removeAllSocketListeners } =
        useController(AppController);
    const [isTyping, setIsTyping] = React.useState(false);
    const fileRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        addSocketListener('typing', (cId) => {
            setIsTyping(conversationId === cId);
        });
        addSocketListener('stop-typing', (cId) => {
            if (conversationId === cId) {
                setIsTyping(false);
            }
        });
        return () => {
            removeAllSocketListeners('typing');
            removeAllSocketListeners('stop-typing');
        };
    }, []);

    const form = useForm({
        initialValues: {
            content: '',
            files: new Array<FileData>(0),
        },
        validationSchema: validator.object({
            content: validator.string().test('contentWithFiles', function (value) {
                if (this.parent.files.length > 0) {
                    return true;
                }
                if (!value) {
                    return false;
                }
                return /^\s*\S[\s\S]*$/.test(value);
            }),
        }),
        onSubmit: (values, { resetForm }) => {
            onSend?.(values.content, values.files);
            resetForm();
        },
    });

    const onBeginEditing = () => {
        emitSocket('typing', conversationId, userId);
    };

    const onEndEditing = () => {
        emitSocket('stop-typing', conversationId, userId);
    };

    const onClickUploader = (isImage?: boolean) => {
        if (fileRef.current) {
            if (isImage) {
                fileRef.current.accept = 'image/*';
            } else {
                fileRef.current.accept = '*';
            }
            fileRef.current?.click();
        }
    };

    const handleReadFile = (file: File) => {
        return new Promise<FileData>((resolve) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (fileReader.readyState === 2 && typeof fileReader.result === 'string') {
                    const objectResult = {
                        file,
                        url: fileReader.result,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                    };

                    if (file.type.startsWith('image/')) {
                        const image = new Image();
                        image.src = fileReader.result;
                        image.onload = () => {
                            resolve({
                                ...objectResult,
                                width: image.width,
                                height: image.height,
                            });
                        };
                    } else if (
                        file.type.startsWith('video/mp4') ||
                        file.type.startsWith('video/ogg')
                    ) {
                        const video = document.createElement('video');
                        video.src = fileReader.result;
                        video.onloadedmetadata = () => {
                            resolve({
                                ...objectResult,
                                width: video.videoWidth,
                                height: video.videoHeight,
                            });
                        };
                    } else {
                        resolve(objectResult);
                    }
                }
            };
            fileReader.readAsDataURL(file);
        });
    };

    const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const promises: Promise<FileData>[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                promises.push(handleReadFile(file));
            }
            Promise.all(promises).then((files) => {
                const pasted = [...form.values.files, ...files];
                form.setFieldValue('files', pasted);
            });
        }
    };

    const handleRemoveSelectedFile = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const element = event.target as HTMLInputElement;
        element.value = '';
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (!e.clipboardData.items[0].type.startsWith('text/')) {
            const promises: Promise<FileData>[] = [];
            for (let index = 0; index < e.clipboardData.items.length; index++) {
                const file = e.clipboardData.items[index].getAsFile();
                if (file) {
                    promises.push(handleReadFile(file));
                }
            }
            Promise.all(promises).then((files) => {
                form.setFieldValue('files', [...form.values.files, ...files]);
            });
        }
    };

    const handleRemovePasted = (index: number) => {
        const pasted = [...form.values.files];
        pasted.splice(index, 1);
        form.setFieldValue('files', pasted);
    };

    const handleChangePasted = (index: number, item: FileData) => {
        const pasted = [...form.values.files];
        pasted[index] = item;
        form.setFieldValue('files', pasted);
    };

    return (
        <>
            <div className="chat-attachment">
                {isTyping && <div className="chat-typing-signal">{t('typing')}</div>}
                <Button
                    className="chat-image-attach"
                    variant="text"
                    title={t('sendPhoto')}
                    onClick={() => onClickUploader(true)}>
                    <FiImage size={25} />
                </Button>
                <Button variant="text" title={t('sendFile')} onClick={() => onClickUploader()}>
                    <ImAttachment size={22} />
                </Button>
            </div>
            <form className="chat-typing-container" onSubmit={form.handleSubmit}>
                <MessageInput
                    id="content"
                    name="content"
                    className="chat-input-text custom-scroll scrolling"
                    placeholder={t('typeMessage')}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    value={form.values.content}
                    onBeginEditing={onBeginEditing}
                    onEndEditing={onEndEditing}
                    onPaste={handlePaste}
                    handleSubmit={form.handleSubmit}
                />
                <>
                    <Button
                        type="submit"
                        className="chat-send-button"
                        variant="text"
                        disabled={!form.isValid}
                        title={t('sendMessage')}>
                        <FiSend size={25} />
                    </Button>
                </>
            </form>
            {form.values.files.length > 0 && (
                <div className="chat-pasted-files-container custom-scroll scrolling">
                    <div className="chat-pasted-files">
                        {form.values.files.map((file, index) => (
                            <PastedFileItem
                                key={index}
                                file={file}
                                onEdited={(file) => handleChangePasted(index, file)}
                                t={t}
                                onRemove={() => handleRemovePasted(index)}
                            />
                        ))}
                    </div>
                </div>
            )}
            <input
                type="file"
                ref={fileRef}
                hidden
                multiple
                onClick={handleRemoveSelectedFile}
                onChange={handleSelectFiles}
            />
        </>
    );
};

export default ChatTyping;
