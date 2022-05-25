import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import createDispatch from '../../common/actions/createDispatch';
import createSelector from '../../common/actions/createSelector';
import LoadingMask from '../../common/components/LoadingMask';
import UserData from '../../common/models/UserData';
import { useFetchConversations } from '../../hooks/chat';
import ChatList from './components/ChatList';
import ChatSection from './components/ChatSection';
import { ChatItem } from './models';

const ChatScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { data: chatData, isLoading } = useFetchConversations();
    const selectedChatItem: ChatItem = useSelector(createSelector('chat.selectedChatItem'));
    const userData: UserData = JSON.parse(window.localStorage.getItem('userData') || '');

    if (isLoading) {
        return <LoadingMask title="Đang tải dữ liệu..." />;
    }

    return (
        <div className="chat-container">
            <ChatList
                data={chatData}
                selectedItem={selectedChatItem}
                userId={userData._id}
                onSelectedItem={(item) => dispatch(createDispatch('chat.selectedChatItem', item))}
            />
            <ChatSection chatItem={selectedChatItem || chatData?.[0]} user={userData} />
        </div>
    );
};

export default ChatScreen;
