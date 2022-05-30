import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import { socket } from '../../../utils/helpers/SocketHelper';
import MessageInput from './MessageInput';

type ChatTypingProps = {
    onSend: (content: string) => void;
    conversationId: string;
    userId: string;
};

const ChatTyping = ({ onSend, conversationId, userId }: ChatTypingProps) => {
    const { t } = useTranslation();
    const [isTyping, setIsTyping] = React.useState(false);

    React.useEffect(() => {
        socket.on('typing', (convId: string) => {
            setIsTyping(conversationId === convId);
        });
        socket.on('stop-typing', (convId: string) => {
            if (conversationId === convId) {
                setIsTyping(false);
            }
        });
        return () => {
            socket.removeAllListeners('typing');
            socket.removeAllListeners('stop-typing');
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            content: '',
        },
        validationSchema: Yup.object({
            content: Yup.string().required(),
        }),
        onSubmit: (values, { resetForm }) => {
            onSend(values.content);
            resetForm();
        },
    });

    const onBeginEditing = () => {
        socket.emit('typing', conversationId, userId);
    };

    const onEndEditing = () => {
        socket.emit('stop-typing', conversationId, userId);
    };

    return (
        <>
            <div className="chat-attachment">
                {isTyping && <div className="chat-typing-signal">{t('typing')}</div>}
                <Button className="chat-image-attach" variant="text" title={t('sendPhoto')}>
                    <Icon name="photo" />
                </Button>
                <Button variant="text" title={t('sendFile')}>
                    <Icon name="file-plus" />
                </Button>
            </div>
            <form className="chat-typing-container" onSubmit={formik.handleSubmit}>
                <MessageInput
                    id="content"
                    name="content"
                    className="chat-input-text"
                    placeholder={t('typeMessage')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                    onBeginEditing={onBeginEditing}
                    onEndEditing={onEndEditing}
                />
                <>
                    <Button
                        type="submit"
                        className="chat-send-button"
                        variant="text"
                        title={t('sendMessage')}>
                        <Icon name="send" />
                    </Button>
                </>
            </form>
        </>
    );
};

export default ChatTyping;
