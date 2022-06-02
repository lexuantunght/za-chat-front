import React from 'react';
import useChatViewModel from './ChatViewModel';
import LoadingMask from '../../common/components/LoadingMask';
import ConversationList from './components/ConversationList';
import welcomeLogo from '../../common/resources/welcome.png';
import ChatSection from './components/ChatSection';

const ChatScreen = () => {
    const {
        conversations,
        getConversations,
        userData,
        isLoading,
        selectedConversation,
        selectConversation,
        sendMessage,
        rejectFriend,
        requestFriend,
        acceptFriend,
        cancelRequest,
        t,
        language,
    } = useChatViewModel();

    React.useEffect(() => {
        getConversations();
    }, []);

    if (isLoading) {
        return <LoadingMask title="Đang tải dữ liệu..." />;
    }

    return (
        <div className="chat-container">
            <div id="chat-sidetab-container">
                <ConversationList
                    data={conversations}
                    selectedItem={selectedConversation}
                    userId={'123'}
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
