import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useQueryClient } from 'react-query';
import _update from 'lodash-es/update';
import _orderBy from 'lodash-es/orderBy';
import { socket } from '../../utils/helpers/SocketHelper';
import createDispatch from '../../common/actions/createDispatch';
import createSelector from '../../common/actions/createSelector';
import LoadingMask from '../../common/components/LoadingMask';
import UserData from '../../common/models/UserData';
import { useFetchConversations } from '../../hooks/chat';
import ChatList from './components/ChatList';
import ChatSection, { ChatSectionRef } from './components/ChatSection';
import { ChatItem, Message } from './models';

const ChatScreen: React.FC = () => {
    const dispatch = useDispatch();
    const client = useQueryClient();
    const { data: chatData, isLoading, isSuccess } = useFetchConversations();
    const selectedChatItem: ChatItem = useSelector(createSelector('chat.selectedChatItem'));
    const userData: UserData = JSON.parse(window.localStorage.getItem('userData') || '');
    const [chatList, setChatList] = React.useState<ChatItem[]>([]);
    const chatSectionRef = React.useRef<ChatSectionRef>(null);

    const updateChatItem = (latestMessage: Message) => {
        let tempChatList = [...chatList];
        const indexOfItem = tempChatList.findIndex(
            (item) => item._id === latestMessage.conversationId
        );
        _update(tempChatList, `[${indexOfItem}].latestMessage`, () => latestMessage);
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
        if (item.latestMessage?.userId !== userData._id) {
            socket.emit('action-message', item.latestMessage, 'seen');
        }
    };

    React.useEffect(() => {
        socket.removeListener('receive-message');
        socket.on('receive-message', (msg: Message) => {
            client.invalidateQueries('conversation_list');
            chatSectionRef.current?.appendMessage(msg);
            socket.emit('action-message', msg, 'received');
        });
        socket.on('status-message', (msg: Message) => {
            chatSectionRef.current?.updateStatusMessage(msg);
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
        if (chatData && isSuccess) {
            const selectedItem = chatData.find((item) => item._id === selectedChatItem?._id);
            if (selectedItem && !selectedItem.latestMessage?.seen?.includes(userData._id)) {
                socket.emit('action-message', selectedChatItem.latestMessage, 'seen');
            }
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
                <ChatSection
                    ref={chatSectionRef}
                    chatItem={selectedChatItem}
                    user={userData}
                    onSend={onSendMessage}
                />
            ) : (
                <div>Welcome to ZaChat</div>
            )}
        </div>
    );
};

export default ChatScreen;
