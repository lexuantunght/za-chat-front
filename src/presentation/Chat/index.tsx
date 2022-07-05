import React from 'react';
import ConversationList from './components/ConversationList';
import welcomeLogo from '../../common/resources/welcome.png';
import ChatSection, { ChatSectionRef } from './components/ChatSection';
import ConversationController from '../../controller/chat/ConversationController';
import useMultilingual from '../../utils/multilingual';
import MessageController from '../../controller/chat/MessageController';
import useController from '../../controller/hooks';
import { Message } from '../../domain/model/Message';
import { UserData } from '../../domain/model/UserData';
import AppController from '../../controller/AppController';
import { Conversation } from '../../domain/model/Conversation';

const ChatScreen = () => {
    const { getConversations, selectConversation } = useController(ConversationController);
    const { getMessages, updateStatusMessage, appendMessage } = useController(MessageController);
    const { useGetState, addSocketListener, emitSocket, removeAllSocketListeners } =
        useController(AppController);
    const userData = useGetState((state) => state.app.userData);
    const conversations = useGetState((state) => state.chat.conversations);
    const selectedConversation = useGetState((state) => state.chat.selectedConversation);
    const messages = useGetState((state) => state.chat.messages);
    const { t, language } = useMultilingual();
    const chatSectionRef = React.useRef<ChatSectionRef>(null);

    const onSelectConversation = (item: Conversation) => {
        if (!userData) return;
        if (
            item.lastMessage &&
            item.lastMessageFromUid !== userData._id &&
            item.lastMessageStatus !== 'seen'
        ) {
            emitSocket(
                'action-message',
                {
                    fromUid: item.lastMessageFromUid,
                    toUid: item._id,
                    seen: [item.lastMessageFromUid, userData._id],
                    status: 'seen',
                },
                'seen'
            );
            selectConversation({ ...item, lastMessageStatus: 'seen' });
        } else {
            selectConversation(item);
        }
    };

    React.useEffect(() => {
        getConversations();
    }, []);

    React.useEffect(() => {
        if (selectedConversation) {
            getMessages(selectedConversation._id);
        }
    }, [selectedConversation?._id]);

    React.useEffect(() => {
        removeAllSocketListeners('receive-message');
        addSocketListener('receive-message', (msg: Message) => {
            appendMessage(msg);
            emitSocket('action-message', msg, 'received');
        });
        addSocketListener('status-message', (msg: Message) => {
            updateStatusMessage(msg);
        });
        return () => {
            removeAllSocketListeners('status-message');
            removeAllSocketListeners('receive-message');
            addSocketListener('receive-message', (msg: Message, user: UserData) => {
                new Notification(user.name, { body: msg.content, icon: user.avatar });
                emitSocket('action-message', msg, 'received');
            });
        };
    }, []);

    React.useEffect(() => {
        if (conversations) {
            const selectedItem = conversations.find(
                (item) => item._id === selectedConversation?._id
            );
            if (
                userData &&
                selectedItem &&
                selectedItem.lastMessageFromUid !== userData._id &&
                selectedItem.lastMessageStatus !== 'seen'
            ) {
                emitSocket('action-message', selectedConversation?.lastMessage, 'seen');
            }
            if (!selectedItem) {
                const item = conversations.find(
                    (conv) => conv.user._id === selectedConversation?.user._id
                );
                if (item) {
                    selectConversation(item);
                }
            }
        }
    }, [conversations]);

    if (!userData) {
        return null;
    }

    return (
        <div className="chat-container">
            <div id="chat-side-tab-container">
                <ConversationList
                    data={conversations}
                    selectedItem={selectedConversation}
                    userData={userData}
                    onSelectedItem={onSelectConversation}
                    onSelectSearchMsgResult={chatSectionRef.current?.scrollToMessage}
                    t={t}
                    language={language}
                />
            </div>
            {selectedConversation ? (
                <ChatSection
                    conversation={selectedConversation}
                    user={userData}
                    ref={chatSectionRef}
                    t={t}
                    language={language}
                    messages={messages}
                />
            ) : (
                <div className="chat-welcome">
                    <div>{t('welcomeZaChat')}</div>
                    <span>{t('welcomeDescription')}</span>
                    <img src={welcomeLogo} />
                </div>
            )}
        </div>
    );
};

export default ChatScreen;
