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
    onLoad?: () => void;
    onClick?: (file: FileData) => void;
};

type FileMessageItemProp = {
    file: FileData;
    style?: React.CSSProperties;
    onLoad?: () => void;
    onClick?: (file: FileData) => void;
    showControllers?: boolean;
};

const FileMessageItem = ({
    file,
    style,
    onLoad,
    onClick,
    showControllers = true,
}: FileMessageItemProp) => {
    if (file.type?.startsWith('video/')) {
        return (
            <Video
                className="message-video"
                url={file.url}
                style={style}
                onLoad={onLoad}
                showControllers={showControllers}
                onClickExtend={() => onClick?.(file)}
            />
        );
    }
    return <Image src={file.url} style={style} onLoad={onLoad} onClick={() => onClick?.(file)} />;
};

const MessageItem = ({
    message,
    index,
    user,
    t,
    conversationAvatar,
    messagesLength,
    nextMessage,
    onLoad,
    onClick,
}: MessageItemProps) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const calculateGrid = () => {
        if (!message.files || message.files.length < 2) {
            return 1;
        }
        if (message.files.length % 2 === 0) {
            return 2;
        }
        return 3;
    };

    const getNumOfCols = React.useMemo(calculateGrid, [message]);

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
                    ref={containerRef}
                    className="chat-message-image-only"
                    style={{ gridTemplateColumns: `repeat(${getNumOfCols}, minmax(0, 1fr))` }}>
                    {message.files.map((file, index) => (
                        <FileMessageItem
                            key={index}
                            file={file}
                            showControllers={getNumOfCols === 1}
                            style={
                                getNumOfCols > 1
                                    ? {
                                          objectFit: 'cover',
                                          aspectRatio: '1/1',
                                      }
                                    : { objectFit: 'contain', aspectRatio: 'auto' }
                            }
                            onLoad={onLoad}
                            onClick={onClick}
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
