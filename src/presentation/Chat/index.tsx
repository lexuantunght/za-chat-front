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
    const { getConversations, selectConversation, updateConversation } =
        useController(ConversationController);
    const { getMessages, updateStatusMessage, updateFilesMessage, appendMessage } =
        useController(MessageController);
    const { useGetState, addSocketListener, emitSocket, removeAllSocketListeners } =
        useController(AppController);
    const userData = useGetState((state) => state.app.userData);
    const conversations = useGetState((state) => state.chat.conversations);
    const selectedConversation = useGetState((state) => state.chat.selectedConversation);
    const { t, language } = useMultilingual();
    const chatSectionRef = React.useRef<ChatSectionRef>(null);

    const onSelectConversation = (item: Conversation) => {
        selectConversation(item);
    };

    const getMessageContent = (latestMessage: Message) => {
        if (latestMessage.files && latestMessage.files.length > 0) {
            if (latestMessage.files.length > 1) {
                return t('sentSomeImages', { value: latestMessage.files.length });
            }
            return t('sentImage');
        }
        return latestMessage.content;
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
            emitSocket('action-message', msg, 'received');
            appendMessage(msg);
        });
        addSocketListener('status-message', (msg: Message) => {
            if (msg.status === 'sent') {
                updateFilesMessage(msg);
            }
            updateStatusMessage(msg);
        });
        return () => {
            removeAllSocketListeners('status-message');
            removeAllSocketListeners('receive-message');
            addSocketListener('receive-message', (msg: Message, user: UserData) => {
                new Notification(user.name, { body: getMessageContent(msg), icon: user.avatar });
                emitSocket('action-message', msg, 'received');
            });
        };
    }, []);

    React.useEffect(() => {
        if (
            userData &&
            selectedConversation &&
            selectedConversation.lastMessageFromUid !== userData._id &&
            selectedConversation.lastMessageStatus !== 'seen'
        ) {
            emitSocket(
                'action-message',
                {
                    fromUid: selectedConversation.lastMessageFromUid,
                    toUid: selectedConversation._id,
                    seen: [selectedConversation.lastMessageFromUid, userData._id],
                    status: 'seen',
                },
                'seen'
            );
            updateConversation({ ...selectedConversation, lastMessageStatus: 'seen' });
        }
    }, [selectedConversation]);

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
                    onSelectSearchMsgResult={(item) =>
                        chatSectionRef.current?.scrollToMessage(item)
                    }
                    t={t}
                    language={language}
                />
            </div>
            {selectedConversation ? (
                <ChatSection
                    key={selectedConversation._id}
                    conversation={selectedConversation}
                    user={userData}
                    ref={chatSectionRef}
                    t={t}
                    language={language}
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
