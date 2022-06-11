import React from 'react';
import moment from 'moment';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import List from '../../../common/components/VirtualizedList';
import ChatTyping from './ChatTyping';
import { Conversation } from '../../../domain/model/Conversation';
import { Message } from '../../../domain/model/Message';
import { UserData } from '../../../domain/model/UserData';
import useController from '../../../controller/hooks';
import AppController from '../../../controller/AppController';

type ChatSectionProps = {
    conversation: Conversation;
    messages: Message[];
    user: UserData;
    onSend: (message: Message) => void;
    onCancelRequestFriend: (userId: string) => void;
    onRequestFriend: (userId: string) => void;
    onAcceptFriend: (userId: string) => void;
    onRejectFriend: (userId: string) => void;
    t: CallableFunction;
    language: string;
};

export type ChatSectionRef = {
    appendMessage: (msg: Message) => void;
    updateStatusMessage: (msg: Message) => void;
};

const ChatSection = ({
    conversation,
    user,
    onSend,
    onCancelRequestFriend,
    onRequestFriend,
    onAcceptFriend,
    onRejectFriend,
    t,
    language,
    messages = [],
}: ChatSectionProps) => {
    const { emitSocket, addSocketListener, removeAllSocketListeners } =
        useController(AppController);
    const partnerId = React.useMemo(
        () => conversation.users.find((u) => u._id !== user?._id)?._id || '',
        [conversation._id, conversation.friendStatus]
    );
    const [activeTime, setActiveTime] = React.useState<string | Date>('');

    React.useEffect(() => {
        addSocketListener('is-active', (active: string, time?: Date) => {
            if (active === 'offline') {
                setActiveTime(moment(time).toDate());
                return;
            }
            setActiveTime(t(active));
        });
        return () => {
            removeAllSocketListeners('is-active');
        };
    }, []);

    React.useEffect(() => {
        emitSocket('get-active', partnerId);
    }, [conversation._id, conversation.friendStatus]);

    const onSendMessage = (content: string) => {
        const msg: Message = {
            content,
            conversationId: conversation._id,
            toUserId: partnerId,
            userId: user?._id || '',
            seen: user?._id ? [user?._id] : [],
            status: 'sending',
            created_at: new Date(),
        };
        onSend(msg);
    };

    return (
        <div className="chat-section">
            <div className="chat-section-title">
                <img className="chat-avatar" src={conversation.avatar} />
                <div className="chat-section-name-info">
                    <div className="chat-section-name">{conversation.name}</div>
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
                {conversation.friendStatus !== 'friend' && (
                    <div className="chat-title-add-friend">
                        {!conversation.friendStatus && (
                            <Button variant="text" onClick={() => onRequestFriend(partnerId)}>
                                <Icon name="user-plus" strokeWidth={1.25} />
                                <span className="add-friend">{t('addFriend')}</span>
                            </Button>
                        )}
                        {conversation.friendStatus === 'requested' && (
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
                        {conversation.friendStatus === 'waiting' && (
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
                <List isVirtualizationEnabled rowHeight={67}>
                    {messages.map((message, index) => (
                        <div
                            key={message.conversationId + index}
                            className={`chat-message-item ${
                                message.userId === user?._id ? 'chat-self-message' : ''
                            }`}>
                            <img
                                className={`chat-avatar ${
                                    index < messages.length - 1 &&
                                    message.userId === messages[index + 1].userId
                                        ? 'chat-avatar-invisible'
                                        : ''
                                }`}
                                src={
                                    message.userId === user?._id ? user.avatar : conversation.avatar
                                }
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
                </List>
            </div>
            <ChatTyping
                onSend={onSendMessage}
                conversationId={conversation._id}
                userId={partnerId || conversation.users[0]._id}
                t={t}
            />
        </div>
    );
};

export default ChatSection;
