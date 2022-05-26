import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../utils/helpers/SocketHelper';
import createDispatch from '../../common/actions/createDispatch';
import createSelector from '../../common/actions/createSelector';
import LoadingMask from '../../common/components/LoadingMask';
import UserData from '../../common/models/UserData';
import { useFetchConversations } from '../../hooks/chat';
import ChatList from './components/ChatList';
import ChatSection from './components/ChatSection';
import { ChatItem, Message } from './models';

const ChatScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { data: chatData, isLoading } = useFetchConversations();
    const selectedChatItem: ChatItem = useSelector(createSelector('chat.selectedChatItem'));
    const userData: UserData = JSON.parse(window.localStorage.getItem('userData') || '');

    const onSendMessage = (message: Message) => {
        socket.emit('send-message', message);
    };

    const onSelectChatItem = (item: ChatItem) => {
        dispatch(createDispatch('chat.selectedChatItem', item));
    };

    if (isLoading) {
        return <LoadingMask title="Đang tải dữ liệu..." />;
    }

    return (
        <div className="chat-container">
            <ChatList
                data={chatData}
                selectedItem={selectedChatItem}
                userId={userData._id}
                onSelectedItem={onSelectChatItem}
            />
            {selectedChatItem ? (
                <ChatSection chatItem={selectedChatItem} user={userData} onSend={onSendMessage} />
            ) : (
                <div>Welcome to ZaChat</div>
            )}
        </div>
    );
};

export default ChatScreen;
