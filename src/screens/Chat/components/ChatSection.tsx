import React from 'react';
import moment from 'moment';
import _update from 'lodash-es/update';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import { ChatItem, Message } from '../models';
import ChatTyping from './ChatTyping';
import { useFetchMessages } from '../../../hooks/chat';
import UserData from '../../../common/models/UserData';
import Socket from '../../../utils/networking/Socket';
import { useMultilingual } from '../../../hooks/translation';

type ChatSectionProps = {
    chatItem: ChatItem;
    user?: UserData;
    onSend: (message: Message) => void;
    onCancelRequestFriend: (userId: string) => void;
    onRequestFriend: (userId: string) => void;
    onAcceptFriend: (userId: string) => void;
    onRejectFriend: (userId: string) => void;
};

export type ChatSectionRef = {
    appendMessage: (msg: Message) => void;
    updateStatusMessage: (msg: Message) => void;
};

const ChatSection = (
    {
        chatItem,
        user,
        onSend,
        onCancelRequestFriend,
        onRequestFriend,
        onAcceptFriend,
        onRejectFriend,
    }: ChatSectionProps,
    ref: React.ForwardedRef<ChatSectionRef>
) => {
    const socket = Socket.getInstance().getSocket();
    const { t, language } = useMultilingual();
    const partnerId = React.useMemo(
        () => chatItem.users.find((u) => u._id !== user?._id)?._id || '',
        [chatItem._id, chatItem.friendStatus]
    );
    const {
        data: messages = [],
        isLoading,
        isSuccess,
    } = useFetchMessages({
        conversationId: chatItem._id,
    });
    const [messageList, setMessageList] = React.useState<Message[]>([]);
    const [activeTime, setActiveTime] = React.useState<string | Date>('');

    React.useEffect(() => {
        socket.on('is-active', (active: string, time?: Date) => {
            if (active === 'offline') {
                setActiveTime(moment(time).toDate());
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
        socket.emit('get-active', partnerId);
    }, [isSuccess, chatItem._id, chatItem.friendStatus]);

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
            if (chatItem._id === msg.conversationId || msg.userId === user?._id) {
                updateMessageStatus(msg);
            }
        },
    }));

    const onSendMessage = (content: string) => {
        const msg: Message = {
            content,
            conversationId: chatItem._id,
            toUserId: partnerId,
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
                    <div>
                        {typeof activeTime === 'string'
                            ? activeTime
                            : t('onlineFor', {
                                  value: moment(activeTime).locale(language).fromNow(),
                              })}
                    </div>
                </div>
                <>
                    <Button className="chat-search" variant="text" title={t('searchMessages')}>
                        <Icon name="search" />
                    </Button>
                    <Button variant="text" className="chat-info" title={t('infoConversation')}>
                        <Icon name="info-circle" />
                    </Button>
                </>
                {chatItem.friendStatus !== 'friend' && (
                    <div className="chat-title-addfriend">
                        {!chatItem.friendStatus && (
                            <Button variant="text" onClick={() => onRequestFriend(partnerId)}>
                                <Icon name="user-plus" strokeWidth={1.25} />
                                <span className="add-friend">{t('addFriend')}</span>
                            </Button>
                        )}
                        {chatItem.friendStatus === 'requested' && (
                            <>
                                <div className="requested-friend">{t('requestedFriend')}</div>
                                <Button
                                    className="cancel-request"
                                    variant="text"
                                    onClick={() => onCancelRequestFriend(partnerId)}>
                                    {t('cancelRequest')}
                                </Button>
                            </>
                        )}
                        {chatItem.friendStatus === 'waiting' && (
                            <>
                                <Button
                                    className="accept-request"
                                    variant="text"
                                    onClick={() => onAcceptFriend(partnerId)}>
                                    {t('acceptRequest')}
                                </Button>
                                <div className="separator" />
                                <Button
                                    className="reject-request"
                                    variant="text"
                                    onClick={() => onRejectFriend(partnerId)}>
                                    {t('rejectRequest')}
                                </Button>
                            </>
                        )}
                    </div>
                )}
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
            <ChatTyping
                onSend={onSendMessage}
                conversationId={chatItem._id}
                userId={partnerId || chatItem.users[0]._id}
            />
        </div>
    );
};

export default React.forwardRef(ChatSection);
