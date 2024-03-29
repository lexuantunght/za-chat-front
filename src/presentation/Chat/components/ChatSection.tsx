import React from 'react';
import moment from 'moment';
import { ObjectID } from 'bson';
import { IoSearch, IoChevronDownOutline, IoPersonAddOutline } from 'react-icons/io5';
import Button from '../../../common/components/Button';
import ChatTyping from './ChatTyping';
import { Conversation } from '../../../domain/model/Conversation';
import { Message } from '../../../domain/model/Message';
import { UserData } from '../../../domain/model/UserData';
import useController from '../../../controller/hooks';
import AppController from '../../../controller/AppController';
import { FileData } from '../../../domain/model/FileData';
import MessageItem from './MessageItem';
import VirtualizedList, { VirtualizedListRef } from '../../../common/components/VirtualizedList';
import { openFileViewer } from '../../../utils/app/eventHandler';
import ContactController from '../../../controller/contact/ContactController';
import MessageController from '../../../controller/chat/MessageController';
import SearchBar from '../../../common/components/SearchBar';
import Avatar from '../../../common/components/Avatar';

export type SenderViewerData = {
    file: FileData;
    from: string;
    time: number;
};

type ChatSectionProps = {
    conversation: Conversation;
    user: UserData;
    t: CallableFunction;
    language: string;
    showSearchButton?: boolean;
};

export type ChatSectionRef = {
    scrollToMessage: (msg: Message) => void;
};

const ChatSection = (
    { conversation, user, t, language, showSearchButton = true }: ChatSectionProps,
    ref: React.ForwardedRef<ChatSectionRef>
) => {
    const { emitSocket, addSocketListener, removeAllSocketListeners, useGetState } =
        useController(AppController);
    const { rejectFriend, acceptFriend, requestFriend, cancelRequest } =
        useController(ContactController);
    const { sendMessage, getMessages, searchMessages, navigateMessage, toggleSearch } =
        useController(MessageController);
    const totalMessages = useGetState((state) => state.chat.totalMessages);
    const messages = useGetState((state) => state.chat.messages);
    const errorConnection = useGetState((state) => state.app.errorConnection);
    const isOpenSearch = useGetState((state) => state.chat.isOpenSearch);
    const searchKeyword = useGetState((state) => state.chat.searchKeyword);
    const isEndTopMsgList = useGetState((state) => state.chat.isEndTopMsgList);
    const isEndBottomMsgList = useGetState((state) => state.chat.isEndBottomMsgList);
    const partnerId = conversation.user._id || '';
    const [activeTime, setActiveTime] = React.useState<string | Date>('');
    const [highlightMsgId, setHighlightMsgId] = React.useState<string | undefined>();
    const [scrolledSearch, setScrolledSearch] = React.useState<string | undefined>();
    const listMsgRef = React.useRef<VirtualizedListRef>(null);
    const [showUnobtrusive, setShowUnobtrusive] = React.useState(false);

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

    React.useImperativeHandle(ref, () => ({
        scrollToMessage: (msg: Message) => {
            setHighlightMsgId(msg._id);
            const indexOfMsg = messages.findIndex((m) => m._id === msg._id);
            if (indexOfMsg >= 0) {
                listMsgRef.current?.scrollToIndex({
                    index: indexOfMsg,
                    behavior: 'auto',
                    align: 'end',
                });
                return;
            }
            if (msg._id) {
                setScrolledSearch(msg._id);
                navigateMessage(msg.toUid, msg.sendTime, msg._id, 15);
            }
        },
    }));

    React.useEffect(() => {
        if (isOpenSearch && scrolledSearch) {
            listMsgRef.current?.scrollToIndex({
                index: messages.findIndex((msg) => msg._id === scrolledSearch),
                behavior: 'auto',
                align: 'end',
            });
            setScrolledSearch(undefined);
        }
    }, [messages]);

    const onSendMessage = (content: string, files?: FileData[]) => {
        const msg: Message = {
            _id: new ObjectID().toString(),
            content,
            files,
            toUid: conversation._id,
            fromUid: user?._id || '',
            userId: partnerId || conversation.userId,
            conversationId: conversation._id,
            seen: user?._id ? [user?._id] : [],
            status: 'sending',
            sendTime: Date.now(),
            type:
                files && files.length > 0
                    ? files[0].type?.startsWith('image/')
                        ? 'image'
                        : 'file'
                    : 'text',
        };
        sendMessage(msg);
    };

    const handleLoadMore = (index: number, isBottom?: boolean) => {
        getMessages(
            conversation._id,
            messages[index].sendTime + (isBottom ? 1 : -1),
            30,
            true,
            isBottom
        );
    };

    const handleScrollToEnd = () => {
        listMsgRef.current?.scrollToIndex({
            index: 'LAST',
            behavior: 'smooth',
            align: 'end',
        });
    };

    return (
        <div className="chat-section">
            <div className="chat-section-title">
                <Avatar
                    className="chat-avatar"
                    src={conversation.user.avatar}
                    name={conversation.user.name}
                />
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
                {showSearchButton && (
                    <Button
                        className="chat-search"
                        variant="text"
                        title={t('searchMessages')}
                        onClick={() => toggleSearch(true)}>
                        <IoSearch size={25} />
                    </Button>
                )}
                {conversation.user.relationshipStatus !== 'friend' && (
                    <div className="chat-title-add-friend">
                        {conversation.user.relationshipStatus === 'stranger' && (
                            <Button variant="text" onClick={() => requestFriend(partnerId)}>
                                <IoPersonAddOutline size={20} />
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
                                onEndEditing={(value) => searchMessages(value, conversation._id)}
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
                    ref={listMsgRef}
                    data={messages}
                    reverse
                    initItemCount={30}
                    spaceBottom={30}
                    spaceTop={60}
                    isEndBottom={isEndBottomMsgList}
                    isEndTop={isEndTopMsgList}
                    onLoadMore={handleLoadMore}
                    onScrolledDistanceCb={(isOver) => {
                        if (isOver !== showUnobtrusive) {
                            setShowUnobtrusive(isOver);
                        }
                    }}
                    fromScrolledDistance={600}
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
                            highlightWords={
                                isOpenSearch && searchKeyword && item._id === highlightMsgId
                                    ? searchKeyword
                                    : undefined
                            }
                            onClick={(file) =>
                                handleClickMessage({
                                    file,
                                    from:
                                        item.fromUid === user._id
                                            ? user.name
                                            : conversation.user.name,
                                    time: item.sendTime,
                                })
                            }
                        />
                    )}
                />
                {showUnobtrusive && (
                    <div className="chat-section-scroll-end" onClick={handleScrollToEnd}>
                        <IoChevronDownOutline size={20} color="#555555" />
                    </div>
                )}
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

export default React.forwardRef(ChatSection);
