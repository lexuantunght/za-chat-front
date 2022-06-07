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

const ChatScreen = () => {
    const {
        getConversations,
        conversationsSelector,
        selectedConversationSelector,
        selectConversation,
        userDataSelector,
    } = useController(ConversationController);
    const userData = useSelector(userDataSelector);
    const conversations = useSelector(conversationsSelector);
    const selectedConversation = useSelector(selectedConversationSelector);
    const { sendMessage } = useController(MessageController);
    const { requestFriend, cancelRequest, acceptFriend, rejectFriend } =
        useController(ContactController);
    const { t, language } = useMultilingual();

    React.useEffect(() => {
        getConversations();
    }, []);

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
                    messages={[]}
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
