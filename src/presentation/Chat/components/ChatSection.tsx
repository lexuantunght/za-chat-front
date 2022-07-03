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
import SearchBar from '../../../common/components/SearchBar';

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

const ChatSection = ({ conversation, user, t, language, messages = [] }: ChatSectionProps) => {
    const { emitSocket, addSocketListener, removeAllSocketListeners, useGetState } =
        useController(AppController);
    const { rejectFriend, acceptFriend, requestFriend, cancelRequest } =
        useController(ContactController);
    const { sendMessage, getMessages, searchMessages, toggleSearch } =
        useController(MessageController);
    const totalMessages = useGetState((state) => state.chat.totalMessages);
    const errorConnection = useGetState((state) => state.app.errorConnection);
    const isOpenSearch = useGetState((state) => state.chat.isOpenSearch);
    const partnerId = conversation.user._id || '';
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
    }, [conversation.user._id, conversation.user.relationshipStatus]);

    const onSendMessage = (content: string, files?: FileData[]) => {
        const msg: Message = {
            content,
            files,
            toUid: conversation._id,
            fromUid: user?._id || '',
            userId: partnerId || conversation.userId,
            seen: user?._id ? [user?._id] : [],
            status: 'sending',
            sendTime: new Date(),
            type:
                files && files.length > 0
                    ? files[0].type?.startsWith('image/')
                        ? 'image'
                        : 'file'
                    : 'text',
        };
        sendMessage(msg);
    };

    const handleLoadMore = (index: number) => {
        getMessages(
            conversation._id,
            moment(messages[index].sendTime).subtract(1, 'millisecond').toDate(),
            30,
            true
        );
    };

    return (
        <div className="chat-section">
            <div className="chat-section-title">
                <img className="chat-avatar" src={conversation.user.avatar} />
                <div className="chat-section-name-info">
                    <div className="chat-section-name">{conversation.user.name}</div>
                    <div>
                        {typeof activeTime === 'string'
                            ? activeTime
                            : t('onlineFor', {
                                  value: moment(activeTime).locale(language).fromNow(),
                              })}
                    </div>
                </div>
                <>
                    <Button
                        className="chat-search"
                        variant="text"
                        title={t('searchMessages')}
                        onClick={() => toggleSearch(true)}>
                        <Icon name="search" />
                    </Button>
                    <Button variant="text" className="chat-info" title={t('infoConversation')}>
                        <Icon name="info-circle" />
                    </Button>
                </>
                {conversation.user.relationshipStatus !== 'friend' && (
                    <div className="chat-title-add-friend">
                        {conversation.user.relationshipStatus === 'stranger' && (
                            <Button variant="text" onClick={() => requestFriend(partnerId)}>
                                <Icon name="user-plus" strokeWidth={1.25} />
                                <span className="add-friend">{t('addFriend')}</span>
                            </Button>
                        )}
                        {conversation.user.relationshipStatus === 'requested' && (
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
                        {conversation.user.relationshipStatus === 'waiting' && (
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
                {isOpenSearch && (
                    <div className="chat-title-search">
                        <div>
                            <SearchBar
                                id="chat-search-input"
                                value="1234"
                                placeholder={t('typeKeyword')}
                                onEndEditing={(value) => searchMessages(value)}
                                autoFocus
                            />
                            <Button variant="text" onClick={() => toggleSearch(false)}>
                                {t('close')}
                            </Button>
                        </div>
                    </div>
                )}
                {errorConnection && (
                    <div className="app-connection-error">{t('errorConnection')}</div>
                )}
            </div>
            <div className="chat-section-body custom-scroll scrolling">
                <VirtualizedList
                    data={messages}
                    reverse
                    initItemCount={30}
                    spaceBottom={30}
                    spaceTop={60}
                    total={totalMessages}
                    onLoadMore={handleLoadMore}
                    rowRenderer={(item, index) => (
                        <MessageItem
                            index={index}
                            t={t}
                            message={item}
                            messagesLength={messages.length}
                            showAvatar={
                                (index > 0 && item.fromUid !== messages[index - 1]?.fromUid) ||
                                (index === 0 && messages.length === totalMessages)
                            }
                            user={user}
                            conversationAvatar={conversation.user.avatar}
                            onClick={(file) =>
                                handleClickMessage({
                                    file,
                                    from: conversation.user.name,
                                    time: item.sendTime,
                                })
                            }
                        />
                    )}
                />
            </div>
            <ChatTyping
                onSend={onSendMessage}
                conversationId={conversation._id}
                userId={partnerId}
                t={t}
            />
        </div>
    );
};

export default ChatSection;
