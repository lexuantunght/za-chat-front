import React from 'react';
import { useValidation } from '../../../utils/form/validation';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import MessageInput from './MessageInput';
import { useForm } from '../../../utils/form/formContent';
import useController from '../../../controller/hooks';
import AppController from '../../../controller/AppController';

type ChatTypingProps = {
    onSend: (content: string) => void;
    conversationId: string;
    userId: string;
    t: CallableFunction;
};

const ChatTyping = ({ onSend, conversationId, userId, t }: ChatTypingProps) => {
    const validator = useValidation();
    const { emitSocket, addSocketListener, removeAllSocketListeners } =
        useController(AppController);
    const [isTyping, setIsTyping] = React.useState(false);

    React.useEffect(() => {
        addSocketListener('typing', (convId) => {
            setIsTyping(conversationId === convId);
        });
        addSocketListener('stop-typing', (convId) => {
            if (conversationId === convId) {
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
            content: validator.string().required(),
        }),
        onSubmit: (values, { resetForm }) => {
            onSend(values.content);
            resetForm();
        },
    });

    const onBeginEditing = () => {
        emitSocket('typing', conversationId, userId);
    };

    const onEndEditing = () => {
        emitSocket('stop-typing', conversationId, userId);
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
