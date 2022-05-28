import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _update from 'lodash-es/update';
import _orderBy from 'lodash-es/orderBy';
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
    const { data: chatData, isLoading, isSuccess } = useFetchConversations();
    const selectedChatItem: ChatItem = useSelector(createSelector('chat.selectedChatItem'));
    const userData: UserData = JSON.parse(window.localStorage.getItem('userData') || '');
    const [chatList, setChatList] = React.useState<ChatItem[]>([]);

    const updateChatItem = (latestMessage: Message) => {
        let tempChatList = [...chatList];
        const indexOfItem = tempChatList.findIndex((item) => item._id === selectedChatItem._id);
        _update(tempChatList, `[${indexOfItem}].latestMessage`, () => ({
            ...latestMessage,
            created_at: new Date(),
        }));
        tempChatList = _orderBy(
            tempChatList,
            (item) => moment(item.latestMessage?.created_at).toDate(),
            ['desc']
        );
        setChatList(tempChatList);
    };

    const onSendMessage = (message: Message) => {
        updateChatItem(message);
        socket.emit('send-message', message);
    };

    const onSelectChatItem = (item: ChatItem) => {
        const sideTab = document.getElementById('chat-sidetab-container');
        sideTab?.classList.remove('chat-sidetab-container-show');

        dispatch(createDispatch('chat.selectedChatItem', item));
    };

    React.useEffect(() => {
        socket.removeListener('receive-message');
        return () => {
            socket.on('receive-message', (msg: Message, user: UserData) => {
                //setMessageList([msg, ...messageList]);
                new Notification(user.name, { body: msg.content, icon: user.avatar });
            });
        };
    }, []);

    React.useEffect(() => {
        if (chatData && isSuccess) {
            setChatList(chatData);
        }
    }, [chatData]);

    if (isLoading) {
        return <LoadingMask title="Đang tải dữ liệu..." />;
    }

    return (
        <div className="chat-container">
            <div id="chat-sidetab-container">
                <ChatList
                    data={chatList}
                    selectedItem={selectedChatItem}
                    userId={userData._id}
                    onSelectedItem={onSelectChatItem}
                />
            </div>
            {selectedChatItem ? (
                <ChatSection chatItem={selectedChatItem} user={userData} onSend={onSendMessage} />
            ) : (
                <div>Welcome to ZaChat</div>
            )}
        </div>
    );
};

export default ChatScreen;
