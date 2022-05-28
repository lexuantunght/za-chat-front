import moment from 'moment';
import React from 'react';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import SearchBar from '../../../common/components/SearchBar';
import { ChatItem } from '../models';

type ChatListProps = {
    data?: ChatItem[];
    focusedIndex?: number;
    onSelectedItem?: (item: ChatItem) => void;
    selectedItem?: ChatItem;
    userId?: string;
};

const ChatList: React.FC<ChatListProps> = ({ data = [], selectedItem, onSelectedItem, userId }) => {
    const onClickItem = (item: ChatItem) => {
        if (userId && !item.latestMessage?.seen?.includes(userId)) {
            item.latestMessage?.seen?.push(userId);
        }
        onSelectedItem?.(item);
    };

    return (
        <div className="chat-tab">
            <div className="chat-tab-header">
                <SearchBar placeholder="Tìm kiếm..." />
                <Button variant="text" className="chat-tab-addcontact">
                    <Icon name="user-plus" />
                </Button>
            </div>
            <div className="chat-list-title">Danh sách hội thoại</div>
            <div className="chat-tab-messages">
                {data.map((chatItem, index) => (
                    <div
                        key={'chat-' + index}
                        className={`chat-item-container ${
                            selectedItem?._id === chatItem._id ? 'chat-item-focused' : ''
                        }`}
                        onClick={() => onClickItem(chatItem)}>
                        <div className="chat-item">
                            <img src={chatItem.avatar} className="chat-avatar" />
                            <div
                                className={
                                    userId && chatItem.latestMessage?.seen?.includes(userId)
                                        ? 'chat-item-seen'
                                        : 'chat-item-notseen'
                                }>
                                <div className="chat-name">{chatItem.name}</div>
                                <div className="chat-message">{`${
                                    chatItem.latestMessage?.userId === userId ? 'Bạn: ' : ''
                                } ${chatItem.latestMessage?.content}`}</div>
                            </div>
                        </div>
                        <div className="chat-latest-time">
                            {moment(chatItem.latestMessage?.created_at).locale('vi').fromNow(true)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
