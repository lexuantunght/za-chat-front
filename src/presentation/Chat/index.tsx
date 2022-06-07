import React from 'react';
import { useSelector } from 'react-redux';
import ConversationList from './components/ConversationList';
import welcomeLogo from '../../common/resources/welcome.png';
import ChatSection from './components/ChatSection';
import ConversationController from '../../controller/chat/ConversationController';
import useMultilingual from '../../utils/multilingual';
import MessageController from '../../controller/chat/MessageController';
import ContactController from '../../controller/contact/ContactController';
import useController from '../../controller/hooks';
import Socket from '../../data/networking/Socket';
import { Message } from '../../domain/model/Message';
import { UserData } from '../../domain/model/UserData';

const ChatScreen = () => {
    const {
        getConversations,
        conversationsSelector,
        selectedConversationSelector,
        selectConversation,
        userDataSelector,
    } = useController(ConversationController);
    const { sendMessage, getMessages, messagesSelector, updateStatusMessage, appendMessage } =
        useController(MessageController);
    const { requestFriend, cancelRequest, acceptFriend, rejectFriend } =
        useController(ContactController);
    const userData = useSelector(userDataSelector);
    const conversations = useSelector(conversationsSelector);
    const selectedConversation = useSelector(selectedConversationSelector);
    const messages = useSelector(messagesSelector);
    const { t, language } = useMultilingual();
    const socket = Socket.getInstance().getSocket();

    React.useEffect(() => {
        getConversations();
    }, []);

    React.useEffect(() => {
        getMessages(selectedConversation?._id || '');
    }, [selectedConversation?._id]);

    React.useEffect(() => {
        socket.removeListener('receive-message');
        socket.on('receive-message', (msg: Message) => {
            appendMessage(msg);
            socket.emit('action-message', msg, 'received');
        });
        socket.on('status-message', (msg: Message) => {
            updateStatusMessage(msg);
        });
        return () => {
            socket.removeAllListeners('status-message');
            socket.removeAllListeners('receive-message');
            socket.on('receive-message', (msg: Message, user: UserData) => {
                new Notification(user.name, { body: msg.content, icon: user.avatar });
                socket.emit('action-message', msg, 'received');
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
                socket.emit('action-message', selectedConversation?.latestMessage, 'seen');
            }
        }
    }, [conversations]);

    return (
        <div className="chat-container">
            <div id="chat-sidetab-container">
                <ConversationList
                    data={conversations}
                    selectedItem={selectedConversation}
                    userId={userData?._id || ''}
                    onSelectedItem={selectConversation}
                    t={t}
                    language={language}
                />
            </div>
            {selectedConversation && userData ? (
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
