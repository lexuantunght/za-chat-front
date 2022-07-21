import React from 'react';
import AppController from '../../controller/AppController';
import ConversationController from '../../controller/chat/ConversationController';
import MessageController from '../../controller/chat/MessageController';
import ContactController from '../../controller/contact/ContactController';
import useController from '../../controller/hooks';
import { Message } from '../../domain/model/Message';
import useMultilingual from '../../utils/multilingual';
import ChatSection from '../Chat/components/ChatSection';
import ContactMenu from './components/ContactMenu';
import FriendRequestList from './components/FriendRequestList';

const ContactScreen = () => {
    const { t, language } = useMultilingual();
    const { getFriendList, useGetState } = useController(ContactController);
    const { getConversations } = useController(ConversationController);
    const { updateStatusMessage } = useController(MessageController);
    const { addSocketListener, removeAllSocketListeners } = useController(AppController);
    const selectedConversation = useGetState((state) => state.chat.selectedConversation);
    const showFriendRequest = useGetState((state) => state.contact.showFriendRequest);
    const userData = useGetState((state) => state.app.userData);
    React.useEffect(() => {
        getConversations();
        getFriendList();
        addSocketListener('status-message', (msg: Message) => {
            updateStatusMessage(msg);
        });
        return () => {
            removeAllSocketListeners('status-message');
        };
    }, []);
    return (
        <div className="contact-container">
            <div id="contacts-side-tab-container">
                <ContactMenu t={t} />
            </div>
            {showFriendRequest ? (
                <FriendRequestList t={t} />
            ) : (
                selectedConversation &&
                userData && (
                    <ChatSection
                        key={selectedConversation._id}
                        conversation={selectedConversation}
                        user={userData}
                        t={t}
                        language={language}
                        showSearchButton={false}
                    />
                )
            )}
        </div>
    );
};

export default ContactScreen;
