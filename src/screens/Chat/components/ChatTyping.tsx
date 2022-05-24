import React from 'react';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';

const ChatTyping: React.FC = () => {
    return (
        <>
            <div className="chat-attachment">
                <Button className="chat-image-attach" variant="text" title="Gửi ảnh">
                    <Icon name="photo" />
                </Button>
                <Button variant="text" title="Gửi tập tin">
                    <Icon name="file-plus" />
                </Button>
            </div>
            <div className="chat-typing-container">
                <input className="chat-input-text" placeholder="Nhập tin nhắn..." />
                <>
                    <Button className="chat-send-button" variant="text" title="Gửi tin nhắn">
                        <Icon name="send" />
                    </Button>
                </>
            </div>
        </>
    );
};

export default ChatTyping;
