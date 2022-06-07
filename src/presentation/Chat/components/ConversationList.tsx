import React from 'react';
import { Contact } from '../../../domain/model/Contact';
import { Conversation } from '../../../domain/model/Conversation';
import { UserData } from '../../../domain/model/UserData';
import { fromNow } from '../../../utils/helpers/momentHelper';
import SearchBox from '../../App/components/SearchBox';

interface ConversationListProps {
    data?: Conversation[];
    focusedIndex?: number;
    onSelectedItem?: (item: Conversation) => void;
    selectedItem?: Conversation;
    userData: UserData;
    t: CallableFunction;
    language: string;
}

const ConversationList = ({
    data = [],
    selectedItem,
    onSelectedItem,
    userData,
    t,
    language,
}: ConversationListProps) => {
    const userId = userData._id;

    const onClickItem = (item: Conversation) => {
        if (!item.latestMessage?.seen?.includes(userId)) {
            item.latestMessage?.seen?.push(userId);
        }
        onSelectedItem?.(item);
    };

    const onClickSearchResult = (contact: Contact) => {
        if (
            userData &&
            (!selectedItem || !selectedItem.users.some((user) => user._id === contact._id))
        ) {
            onSelectedItem?.({
                _id: contact.conversationId || '',
                avatar: contact.avatar,
                friendStatus: contact.friendStatus,
                name: contact.name,
                users: [userData, contact],
            });
        }
    };

    return (
        <div className="chat-tab">
            <SearchBox t={t} onClickResult={onClickSearchResult} />
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
                            {fromNow(chatItem.latestMessage?.created_at, language)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationList;
