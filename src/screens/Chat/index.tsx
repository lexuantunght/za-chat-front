import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import createDispatch from '../../common/actions/createDispatch';
import createSelector from '../../common/actions/createSelector';
import ChatList from './components/ChatList';
import ChatSection from './components/ChatSection';
import { ChatItem } from './models';

const chatData = [
    {
        _id: '123456',
        avatar: 'https://fakeimg.pl/300/',
        name: 'Tran Van A',
        latestMessage: {
            content: 'Hello anh em nha',
            created_at: new Date('11/5/2022'),
            chatItemId: '123456',
            userId: '54321'
        },
        messages: [
            {
                content: 'Xin chao hahaha',
                created_at: new Date('5/11/2022'),
                userId: '12345',
                chatItemId: '123456'
            },
            {
                content: 'Hello anh em nha',
                created_at: new Date('11/5/2022'),
                userId: '54321',
                chatItemId: '123456'
            },
            {
                content: 'Hello anh em nha',
                created_at: new Date('11/5/2022'),
                userId: '54321',
                chatItemId: '123456'
            },
            {
                content: 'Hello anh em nha',
                created_at: new Date('11/5/2022'),
                userId: '54321',
                chatItemId: '123456'
            },
            {
                content: 'Hello anh em nha',
                created_at: new Date('11/5/2022'),
                userId: '54321',
                chatItemId: '123456'
            },
            {
                content: 'Hello anh em nha',
                created_at: new Date('11/5/2022'),
                userId: '54321',
                chatItemId: '123456'
            },
            {
                content: 'Hello anh em nha',
                created_at: new Date('11/5/2022'),
                userId: '54321',
                chatItemId: '123456'
            },
            {
                content: 'Bye nha',
                created_at: new Date('5/11/2022'),
                userId: '54321',
                chatItemId: '123456'
            }
        ]
    },
    {
        _id: '123457',
        avatar: 'https://fakeimg.pl/300/',
        name: 'Tran Van B',
        latestMessage: {
            content: 'Hello anh em nha',
            created_at: new Date('11/5/2022'),
            chatItemId: '123456',
            userId: '12345'
        }
    },
    {
        _id: '123458',
        avatar: 'https://fakeimg.pl/300/',
        name: 'Tran Van C',
        latestMessage: {
            content: 'Hello anh em nha',
            created_at: new Date('5/5/2022'),
            chatItemId: '123456',
            userId: '12345'
        }
    }
];

const ChatScreen: React.FC = () => {
    const dispatch = useDispatch();
    const selectedChatItem: ChatItem = useSelector(createSelector('chat.selectedChatItem')) || chatData[0];
    return (
        <div className="chat-container">
            <ChatList
                data={chatData}
                selectedItemId={selectedChatItem._id}
                onSelectedItem={(item) => dispatch(createDispatch('chat.selectedChatItem', item))}
            />
            <ChatSection chatItem={selectedChatItem} />
        </div>
    );
};

export default ChatScreen;
