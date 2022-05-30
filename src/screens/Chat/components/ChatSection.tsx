import React from 'react';
import moment from 'moment';
import _update from 'lodash-es/update';
import { useTranslation } from 'react-i18next';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import { ChatItem, Message } from '../models';
import ChatTyping from './ChatTyping';
import { useFetchMessages } from '../../../hooks/chat';
import UserData from '../../../common/models/UserData';
import { socket } from '../../../utils/helpers/SocketHelper';

type ChatSectionProps = {
    chatItem: ChatItem;
    user?: UserData;
    onSend: (message: Message) => void;
};

export type ChatSectionRef = {
    appendMessage: (msg: Message) => void;
    updateStatusMessage: (msg: Message) => void;
};

const ChatSection = (
    { chatItem, user, onSend }: ChatSectionProps,
    ref: React.ForwardedRef<ChatSectionRef>
) => {
    const { t, i18n } = useTranslation();
    const {
        data: messages = [],
        isLoading,
        isSuccess,
    } = useFetchMessages({ conversationId: chatItem._id });
    const [messageList, setMessageList] = React.useState<Message[]>([]);
    const [activeTime, setActiveTime] = React.useState('');

    React.useEffect(() => {
        socket.on('is-active', (active: string, time?: Date) => {
            if (active === 'offline') {
                setActiveTime(t('online', { value: moment(time).locale(i18n.language).fromNow() }));
                return;
            }
            setActiveTime(t(active));
        });
        return () => {
            socket.removeAllListeners('is-active');
        };
    }, []);

    React.useEffect(() => {
        if (isSuccess) {
            setMessageList(messages);
        }
        socket.emit('get-active', chatItem.users.find((u) => u._id !== user?._id)?._id);
    }, [isSuccess, chatItem._id]);

    const updateMessageStatus = (msg: Message) => {
        const tempMessageList = [...messageList];
        _update(tempMessageList, `[0].status`, () => msg.status);
        setMessageList(tempMessageList);
    };

    React.useImperativeHandle(ref, () => ({
        appendMessage: (msg: Message) => {
            if (chatItem._id === msg.conversationId) {
                setMessageList([msg, ...messageList]);
            }
        },
        updateStatusMessage: (msg: Message) => {
            if (chatItem._id === msg.conversationId) {
                updateMessageStatus(msg);
            }
        },
    }));

    const onSendMessage = (content: string) => {
        const msg: Message = {
            content,
            conversationId: chatItem._id,
            userId: user?._id || '',
            seen: user?._id ? [user?._id] : [],
            status: 'sending',
            created_at: new Date(),
        };
        setMessageList([msg, ...messageList]);
        onSend(msg);
    };

    if (isLoading) {
        return null;
    }

    return (
        <div className="chat-section">
            <div className="chat-section-title">
                <img className="chat-avatar" src={chatItem.avatar} />
                <div className="chat-section-name-info">
                    <div className="chat-section-name">{chatItem.name}</div>
                    <div>{activeTime}</div>
                </div>
                <>
                    <Button className="chat-search" variant="text" title={t('searchMessages')}>
                        <Icon name="search" />
                    </Button>
                    <Button variant="text" className="chat-info" title={t('infoConversation')}>
                        <Icon name="info-circle" />
                    </Button>
                </>
            </div>
            <div className="chat-section-body custom-scroll scrolling">
                <br />
                {messageList.map((message, index, msgArr) => (
                    <div
                        key={message.conversationId + index}
                        className={`chat-message-item ${
                            message.userId === user?._id ? 'chat-self-message' : ''
                        }`}>
                        <img
                            className={`chat-avatar ${
                                index < msgArr.length - 1 &&
                                message.userId === msgArr[index + 1].userId
                                    ? 'chat-avatar-invisible'
                                    : ''
                            }`}
                            src={message.userId === user?._id ? user.avatar : chatItem.avatar}
                        />

                        <div>
                            <div className="chat-message-content">{message.content}</div>
                            <div>
                                <small className="chat-message-time">
                                    {moment(message.created_at).format('hh:mm')}
                                </small>
                                {index === 0 && message.userId === user?._id && (
                                    <small>{t(message.status)}</small>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <br />
            </div>
            <ChatTyping onSend={onSendMessage} />
        </div>
    );
};

export default React.forwardRef(ChatSection);
