import React from 'react';
import { useValidation } from '../../../utils/form/validation';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import Socket from '../../../utils/networking/Socket';
import MessageInput from './MessageInput';
import { useForm } from '../../../utils/form/formContent';

type ChatTypingProps = {
    onSend: (content: string) => void;
    conversationId: string;
    userId: string;
    t: CallableFunction;
};

const ChatTyping = ({ onSend, conversationId, userId, t }: ChatTypingProps) => {
    const validator = useValidation();
    const socket = Socket.getInstance().getSocket();
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

    const form = useForm({
        initialValues: {
            content: '',
        },
        validationSchema: validator.object({
            content: validator.string().required(),
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
                        title={t('sendMessage')}>
                        <Icon name="send" />
                    </Button>
                </>
            </form>
        </>
    );
};

export default ChatTyping;
