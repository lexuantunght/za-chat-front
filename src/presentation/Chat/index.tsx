import React from 'react';
import ConversationList from './components/ConversationList';
import welcomeLogo from '../../common/resources/welcome.png';
import ChatSection from './components/ChatSection';
import ConversationController from '../../controller/chat/ConversationController';
import useMultilingual from '../../utils/multilingual';
import MessageController from '../../controller/chat/MessageController';
import ContactController from '../../controller/contact/ContactController';
import useController from '../../controller/hooks';
import { Message } from '../../domain/model/Message';
import { UserData } from '../../domain/model/UserData';
import AppController from '../../controller/AppController';

const ChatScreen = () => {
    const { getConversations, selectConversation } = useController(ConversationController);
    const { sendMessage, getMessages, updateStatusMessage, appendMessage } =
        useController(MessageController);
    const { requestFriend, cancelRequest, acceptFriend, rejectFriend } =
        useController(ContactController);
    const { useGetState, addSocketListener, emitSocket, removeAllSocketListeners } =
        useController(AppController);
    const userData = useGetState((state) => state.app.userData);
    const conversations = useGetState((state) => state.chat.conversations);
    const selectedConversation = useGetState((state) => state.chat.selectedConversation);
    const messages = useGetState((state) => state.chat.messages);
    const { t, language } = useMultilingual();

    React.useEffect(() => {
        getConversations();
    }, []);

    React.useEffect(() => {
        getMessages(selectedConversation?._id || '');
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
            if (!selectedItem && selectedConversation) {
                selectConversation();
            }
            if (
                userData &&
                selectedItem &&
                !selectedItem.latestMessage?.seen?.includes(userData._id)
            ) {
                emitSocket('action-message', selectedConversation?.latestMessage, 'seen');
            }
        }
    }, [conversations]);

    if (!userData) {
        return null;
    }

    return (
        <div className="chat-container">
            <div id="chat-sidetab-container">
                <ConversationList
                    data={conversations}
                    selectedItem={selectedConversation}
                    userData={userData}
                    onSelectedItem={selectConversation}
                    t={t}
                    language={language}
                />
            </div>
            {selectedConversation ? (
                <ChatSection
                    conversation={selectedConversation}
                    user={userData}
                    onSend={sendMessage}
                    onCancelRequestFriend={cancelRequest}
                    onRequestFriend={requestFriend}
                    onAcceptFriend={acceptFriend}
                    onRejectFriend={rejectFriend}
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
