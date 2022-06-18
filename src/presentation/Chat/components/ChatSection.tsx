import React from 'react';
import moment from 'moment';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import ChatTyping from './ChatTyping';
import { Conversation } from '../../../domain/model/Conversation';
import { Message } from '../../../domain/model/Message';
import { UserData } from '../../../domain/model/UserData';
import useController from '../../../controller/hooks';
import AppController from '../../../controller/AppController';
import { FileData } from '../../../domain/model/FileData';
import MessageItem from './MessageItem';
import VirtualizedList from '../../../common/components/VirtualizedList';
import { openFileViewer } from '../../../utils/app/eventHandler';
import ContactController from '../../../controller/contact/ContactController';
import MessageController from '../../../controller/chat/MessageController';

export type SenderViewerData = {
    file: FileData;
    from: string;
    time: Date;
};

type ChatSectionProps = {
    conversation: Conversation;
    messages: Message[];
    user: UserData;
    t: CallableFunction;
    language: string;
};

export type ChatSectionRef = {
    appendMessage: (msg: Message) => void;
    updateStatusMessage: (msg: Message) => void;
};

const ChatSection = ({ conversation, user, t, language, messages = [] }: ChatSectionProps) => {
    const { emitSocket, addSocketListener, removeAllSocketListeners } =
        useController(AppController);
    const { rejectFriend, acceptFriend, requestFriend, cancelRequest } =
        useController(ContactController);
    const { sendMessage } = useController(MessageController);
    const partnerId = React.useMemo(
        () => conversation.users.find((u) => u._id !== user?._id)?._id || '',
        [conversation._id, conversation.friendStatus]
    );
    const [activeTime, setActiveTime] = React.useState<string | Date>('');

    const handleClickMessage = (data: SenderViewerData) => {
        openFileViewer(data);
    };

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
        sendMessage(msg);
    };

    const onSendFiles = (files: FileData[]) => {
        const msg: Message = {
            content: '',
            conversationId: conversation._id,
            toUserId: partnerId,
            files,
            userId: user?._id || '',
            seen: user?._id ? [user?._id] : [],
            status: 'sending',
            created_at: new Date(),
        };
        sendMessage(msg);
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
                            <Button variant="text" onClick={() => requestFriend(partnerId)}>
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
                                    onClick={() => cancelRequest(partnerId)}>
                                    {t('cancelRequest')}
                                </Button>
                            </>
                        )}
                        {conversation.friendStatus === 'waiting' && (
                            <>
                                <Button
                                    className="accept-request"
                                    variant="text"
                                    onClick={() => acceptFriend(partnerId)}>
                                    {t('acceptRequest')}
                                </Button>
                                <div className="separator" />
                                <Button
                                    className="reject-request"
                                    variant="text"
                                    onClick={() => rejectFriend(partnerId)}>
                                    {t('rejectRequest')}
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="chat-section-body custom-scroll scrolling">
                <VirtualizedList
                    data={messages}
                    rowRenderer={(item, index, measure) => (
                        <MessageItem
                            index={index}
                            t={t}
                            message={item}
                            messagesLength={messages.length}
                            nextMessage={messages[index + 1]}
                            user={user}
                            conversationAvatar={conversation.avatar}
                            onLoad={measure}
                            onClick={(file) =>
                                handleClickMessage({
                                    file,
                                    from: conversation.name,
                                    time: item.created_at,
                                })
                            }
                        />
                    )}
                />
            </div>
            <ChatTyping
                onSend={onSendMessage}
                onSendFiles={onSendFiles}
                conversationId={conversation._id}
                userId={partnerId || conversation.users[0]._id}
                t={t}
            />
        </div>
    );
};

export default ChatSection;
