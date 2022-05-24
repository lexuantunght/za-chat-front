import moment from 'moment';
import React from 'react';
import { ChatItem } from '../models';

type ChatListProps = {
    data?: ChatItem[];
    focusedIndex?: number;
    onSelectedItem?: (item: ChatItem) => void;
    selectedItemId?: string;
};

const ChatList: React.FC<ChatListProps> = ({ data = [], selectedItemId, onSelectedItem }) => {
    return (
        <div className="chat-tab">
            {data.map((chatItem, index) => (
                <div
                    key={'chat-' + index}
                    className={`chat-item-container ${selectedItemId === chatItem._id ? 'chat-item-focused' : ''}`}
                    onClick={() => onSelectedItem?.(chatItem)}>
                    <div className="chat-item">
                        <img src={chatItem.avatar} className="chat-avatar" />
                        <div>
                            <div className="chat-name">{chatItem.name}</div>
                            <div className="chat-message">{chatItem.latestMessage?.content}</div>
                        </div>
                    </div>
                    <div className="chat-latest-time">
                        {moment(chatItem.latestMessage?.created_at).locale('vi').fromNow(true)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatList;
