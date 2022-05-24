import React from 'react';
import moment from 'moment';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import { ChatItem } from '../models';
import ChatTyping from './ChatTyping';

type ChatSectionProps = {
    chatItem: ChatItem;
};

const ChatSection: React.FC<ChatSectionProps> = ({ chatItem }) => {
    return (
        <div className="chat-section">
            <div className="chat-section-title">
                <img className="chat-avatar" src={chatItem.avatar} />
                <div className="chat-section-name-info">
                    <div className="chat-section-name">{chatItem.name}</div>
                    <div>dang hoat dong</div>
                </div>
                <>
                    <Button className="chat-search" variant="text" title="Tìm kiếm tin nhắn">
                        <Icon name="search" />
                    </Button>
                    <Button variant="text" className="chat-info" title="Thông tin hội thoại">
                        <Icon name="info-circle" />
                    </Button>
                </>
            </div>
            <div className="chat-section-body custom-scroll scrolling">
                <br />
                {chatItem.messages?.map((message, index) => (
                    <div
                        key={message.chatItemId + index}
                        className={`chat-message-item ${message.userId === '12345' ? 'chat-self-message' : ''}`}>
                        <img
                            className={`chat-avatar ${
                                index > 0 && message.userId === chatItem.messages?.[index - 1].userId
                                    ? 'chat-avatar-invisible'
                                    : ''
                            }`}
                            src={chatItem.avatar}
                        />

                        <div>
                            <div className="chat-message-content">{message.content}</div>
                            <small className="chat-message-time">{moment(message.created_at).format('hh:mm')}</small>
                        </div>
                    </div>
                ))}
                <br />
            </div>
            <ChatTyping />
        </div>
    );
};

export default ChatSection;
