import React from 'react';
import { useValidation } from '../../../utils/form/validation';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import MessageInput from './MessageInput';
import { useForm } from '../../../utils/form/formContent';
import useController from '../../../controller/hooks';
import AppController from '../../../controller/AppController';
import { FileData } from '../../../domain/model/FileData';

type ChatTypingProps = {
    onSend?: (content: string) => void;
    onSendFiles?: (data: FileData[]) => void;
    conversationId: string;
    userId: string;
    t: CallableFunction;
};

const ChatTyping = ({ onSend, conversationId, userId, t, onSendFiles }: ChatTypingProps) => {
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
        },
        validationSchema: validator.object({
            content: validator
                .string()
                .matches(/^\s*\S[\s\S]*$/)
                .required(),
        }),
        onSubmit: (values, { resetForm }) => {
            onSend?.(values.content);
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
        if (isImage && fileRef.current) {
            fileRef.current.accept = 'image/*';
        }
        fileRef.current?.click();
    };

    const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const promises: Promise<FileData>[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                promises.push(
                    new Promise((resolve) => {
                        const fileReader = new FileReader();
                        fileReader.onload = () => {
                            if (
                                fileReader.readyState === 2 &&
                                typeof fileReader.result === 'string'
                            ) {
                                resolve({
                                    file,
                                    url: fileReader.result,
                                    name: file.name,
                                    type: file.type,
                                });
                            }
                        };
                        fileReader.readAsDataURL(file);
                    })
                );
            }
            Promise.all(promises).then((files) => {
                onSendFiles?.(files);
            });
        }
    };

    const handleRemoveSelectedFile = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const element = event.target as HTMLInputElement;
        element.value = '';
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
                    <Icon name="photo" />
                </Button>
                <Button variant="text" title={t('sendFile')} onClick={() => onClickUploader()}>
                    <Icon name="file-plus" />
                </Button>
            </div>
            <form className="chat-typing-container" onSubmit={form.handleSubmit}>
                <MessageInput
                    id="content"
                    name="content"
                    className="chat-input-text"
                    placeholder={t('typeMessage')}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    value={form.values.content}
                    onBeginEditing={onBeginEditing}
                    onEndEditing={onEndEditing}
                />
                <>
                    <Button
                        type="submit"
                        className="chat-send-button"
                        variant="text"
                        disabled={!form.isValid}
                        title={t('sendMessage')}>
                        <Icon name="send" />
                    </Button>
                </>
            </form>
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
