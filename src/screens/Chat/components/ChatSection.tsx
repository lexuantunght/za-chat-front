import React from 'react';
import moment from 'moment';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import { ChatItem, Message } from '../models';
import ChatTyping from './ChatTyping';
import { useFetchMessages } from '../../../hooks/chat';
import UserData from '../../../common/models/UserData';

type ChatSectionProps = {
    chatItem: ChatItem;
    user?: UserData;
    onSend: (message: Message) => void;
};

const ChatSection: React.FC<ChatSectionProps> = ({ chatItem, user, onSend }) => {
    const {
        data: messages = [],
        isLoading,
        isSuccess,
    } = useFetchMessages({ conversationId: chatItem._id });
    const [messageList, setMessageList] = React.useState<Message[]>([]);

    React.useEffect(() => {
        if (isSuccess) {
            setMessageList(messages);
        }
    }, [isSuccess, chatItem._id]);

    const onSendMessage = (content: string) => {
        const msg = {
            content,
            conversationId: chatItem._id,
            userId: user?._id || '',
        };
        setMessageList([msg, ...messageList]);
        onSend(msg);
    };

    if (isLoading) {
        return null;
    }

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
                {messageList.map((message, index, msgArr) => (
                    <div
                        key={message.conversationId + index}
                        className={`chat-message-item ${
                            message.userId === user?._id ? 'chat-self-message' : ''
                        }`}>
                        <img
                            className={`chat-avatar ${
                                index < msgArr.length - 1 &&
                                message.userId === msgArr[index + 1].userId
                                    ? 'chat-avatar-invisible'
                                    : ''
                            }`}
                            src={message.userId === user?._id ? user.avatar : chatItem.avatar}
                        />

                        <div>
                            <div className="chat-message-content">{message.content}</div>
                            <small className="chat-message-time">
                                {moment(message.created_at).format('hh:mm')}
                            </small>
                        </div>
                    </div>
                ))}
                <br />
            </div>
            <ChatTyping onSend={onSendMessage} />
        </div>
    );
};

export default ChatSection;
