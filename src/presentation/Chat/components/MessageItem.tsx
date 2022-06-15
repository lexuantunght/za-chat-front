import React from 'react';
import moment from 'moment';
import { Message } from '../../../domain/model/Message';
import { UserData } from '../../../domain/model/UserData';
import Image from '../../../common/components/Image';
import { FileData } from '../../../domain/model/FileData';
import Video from '../../../common/components/Video';

type MessageItemProps = {
    message: Message;
    index: number;
    user?: UserData;
    t: CallableFunction;
    conversationAvatar?: string;
    nextMessage?: Message;
    messagesLength: number;
};

type FileMessageItemProp = {
    file: FileData;
    style?: React.CSSProperties;
};

const FileMessageItem = ({ file, style }: FileMessageItemProp) => {
    if (file.type?.startsWith('video/')) {
        return <Video className="message-video" url={file.url} />;
    }
    return <Image src={file.url} style={style} />;
};

const MessageItem = ({
    message,
    index,
    user,
    t,
    conversationAvatar,
    messagesLength,
    nextMessage,
}: MessageItemProps) => {
    const getNumOfCols = React.useMemo(() => {
        if (!message.files || message.files.length < 2) {
            return 1;
        }
        if (message.files.length % 2 === 0) {
            return 2;
        }
        return 3;
    }, [message]);

    return (
        <div
            key={message.conversationId + index}
            className={`chat-message-item ${
                message.userId === user?._id ? 'chat-self-message' : ''
            }`}>
            {index < messagesLength - 1 && message.userId === nextMessage?.userId ? (
                <span className="chat-avatar" />
            ) : (
                <img
                    className="chat-avatar"
                    src={message.userId === user?._id ? user.avatar : conversationAvatar}
                />
            )}

            {message.files && message.files.length > 0 && !message.content ? (
                <div
                    className="chat-message-image-only"
                    style={{ gridTemplateColumns: `repeat(${getNumOfCols}, minmax(0, 1fr))` }}>
                    {message.files.map((file, index) => (
                        <FileMessageItem
                            key={index}
                            file={file}
                            style={
                                getNumOfCols > 1
                                    ? {
                                          objectFit: 'cover',
                                          aspectRatio: '1/1',
                                      }
                                    : { objectFit: 'contain', aspectRatio: 'auto' }
                            }
                        />
                    ))}

                    <div
                        className="chat-message-stamp"
                        style={{ gridColumn: `span ${getNumOfCols} / span ${getNumOfCols}` }}>
                        <small className="chat-message-time">
                            {moment(message.created_at).format('hh:mm')}
                        </small>
                        {index === 0 && message.userId === user?._id && (
                            <small>{t(message.status)}</small>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="chat-message-content">
                        {message.files && message.files.length > 0 && (
                            <img width={100} height={100} src={message.files[0].url} />
                        )}
                        {message.content}
                    </div>
                    <div>
                        <small className="chat-message-time">
                            {moment(message.created_at).format('hh:mm')}
                        </small>
                        {index === 0 && message.userId === user?._id && (
                            <small>{t(message.status)}</small>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default MessageItem;
