import React from 'react';
import moment from 'moment';
import { Conversation } from '../../../domain/model/Conversation';
import { UserData } from '../../../domain/model/UserData';
import SearchBox from '../../App/components/SearchBox';
import useController from '../../../controller/hooks';
import ConversationController from '../../../controller/chat/ConversationController';

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
    const { getConversations } = useController(ConversationController);

    const onClickItem = (item: Conversation) => {
        onSelectedItem?.(item);
        const sideTab = document.getElementById(`chat-side-tab-container`);
        if (sideTab?.classList.contains(`chat-side-tab-container-show`)) {
            sideTab?.classList.remove(`chat-side-tab-container-show`);
        } else {
            sideTab?.classList.add(`chat-side-tab-container-show`);
        }
    };

    const onClickSearchResult = (contact: UserData) => {
        if (selectedItem?.user._id === contact._id) {
            return;
        }
        const conversation = data.find((conv) => conv.user._id === contact._id);
        if (conversation) {
            onSelectedItem?.(conversation);
        } else {
            onSelectedItem?.({
                _id: '',
                userId: contact._id,
                user: contact,
                isGroup: false,
            });
        }
    };

    const getLatestMessageContent = (
        lastMessage?: string,
        messageType?: 'file' | 'text' | 'image'
    ) => {
        if (messageType === 'image') {
            return t('image');
        }
        if (messageType === 'file') {
            return t('file');
        }

        return lastMessage;
    };

    return (
        <div className="chat-tab">
            <SearchBox
                t={t}
                onClickResult={onClickSearchResult}
                onClose={() => getConversations()}
            />
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
                            <img src={chatItem.user.avatar} className="chat-avatar" />
                            <div
                                className={
                                    chatItem.lastMessageFromUid === userId ||
                                    chatItem.lastMessageStatus === 'seen' ||
                                    chatItem._id === selectedItem?._id
                                        ? 'chat-item-seen'
                                        : 'chat-item-not-seen'
                                }>
                                <div className="chat-item-head">
                                    <div className="chat-name">{chatItem.user.name}</div>
                                    <div className="chat-latest-time">
                                        {moment(chatItem.lastMessageTime)
                                            .locale(language)
                                            .fromNow(true)}
                                    </div>
                                </div>
                                <div className="chat-message">{`${
                                    chatItem.lastMessageFromUid === userId ? `${t('you')}: ` : ''
                                } ${getLatestMessageContent(
                                    chatItem.lastMessage,
                                    chatItem.lastMessageType
                                )}`}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationList;
