import moment from 'moment';
import React from 'react';
import { useMultilingual } from '../../../hooks/translation';
import SearchView from '../../App/SearchView';
import { ChatItem } from '../models';

type ChatListProps = {
    data?: ChatItem[];
    focusedIndex?: number;
    onSelectedItem?: (item: ChatItem) => void;
    selectedItem?: ChatItem;
    userId?: string;
};

const ChatList: React.FC<ChatListProps> = ({ data = [], selectedItem, onSelectedItem, userId }) => {
    const { t, language } = useMultilingual();
    const onClickItem = (item: ChatItem) => {
        if (userId && !item.latestMessage?.seen?.includes(userId)) {
            item.latestMessage?.seen?.push(userId);
        }
        onSelectedItem?.(item);
    };

    return (
        <div className="chat-tab">
            <SearchView />
            <div className="chat-list-title">{t('conversations')}</div>
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
                                    (userId && chatItem.latestMessage?.seen?.includes(userId)) ||
                                    chatItem._id === selectedItem?._id
                                        ? 'chat-item-seen'
                                        : 'chat-item-notseen'
                                }>
                                <div className="chat-name">{chatItem.name}</div>
                                <div className="chat-message">{`${
                                    chatItem.latestMessage?.userId === userId ? `${t('you')}: ` : ''
                                } ${chatItem.latestMessage?.content}`}</div>
                            </div>
                        </div>
                        <div className="chat-latest-time">
                            {moment(chatItem.latestMessage?.created_at)
                                .locale(language)
                                .fromNow(true)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
