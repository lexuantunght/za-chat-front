import React from 'react';
import moment from 'moment';
import { Message } from '../../../domain/model/Message';
import { UserData } from '../../../domain/model/UserData';
import Image from '../../../common/components/Image';
import { FileData } from '../../../domain/model/FileData';
import Video from '../../../common/components/Video';
import Highlighter from 'react-highlight-words';

type MessageItemProps = {
    message: Message;
    index: number;
    user?: UserData;
    t: CallableFunction;
    conversationAvatar?: string;
    messagesLength: number;
    showAvatar?: boolean;
    onLoad?: () => void;
    onClick?: (file: FileData) => void;
    highlightWords?: string[];
};

type FileMessageItemProp = {
    file: FileData;
    style?: React.CSSProperties;
    onLoad?: () => void;
    onClick?: (file: FileData) => void;
    showControllers?: boolean;
    inGrid?: boolean;
};

const FileMessageItem = ({
    file,
    style,
    onLoad,
    onClick,
    inGrid,
    showControllers = true,
}: FileMessageItemProp) => {
    if (file.type?.startsWith('video/')) {
        return (
            <Video
                className="message-video"
                url={file.url}
                style={{ ...style, cursor: 'pointer' }}
                originHeight={file.height}
                originWidth={file.width}
                maxHeight={inGrid ? 120 : 400}
                onLoad={onLoad}
                showControllers={showControllers}
                onClickExtend={() => onClick?.(file)}
            />
        );
    }
    return (
        <Image
            src={file.url}
            style={{ ...style, cursor: 'pointer' }}
            originHeight={inGrid ? 400 : file.height}
            originWidth={inGrid ? 400 : file.width}
            maxHeight={inGrid ? undefined : 400}
            onLoad={onLoad}
            onClick={() => onClick?.(file)}
            className="message-image"
        />
    );
};

const MessageItem = ({
    message,
    index,
    user,
    t,
    conversationAvatar,
    messagesLength,
    showAvatar,
    onLoad,
    onClick,
    highlightWords,
}: MessageItemProps) => {
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
            key={message.toUid + index}
            className={`chat-message-item ${
                message.fromUid === user?._id ? 'chat-self-message' : ''
            }`}>
            {!showAvatar ? (
                <span className="chat-avatar" />
            ) : (
                <img
                    className="chat-avatar"
                    src={message.fromUid === user?._id ? user.avatar : conversationAvatar}
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
                            showControllers={getNumOfCols === 1}
                            inGrid={getNumOfCols > 1}
                            style={{ objectFit: getNumOfCols > 1 ? 'cover' : 'contain' }}
                            onLoad={onLoad}
                            onClick={onClick}
                        />
                    ))}

                    <div
                        className="chat-message-stamp"
                        style={{ gridColumn: `span ${getNumOfCols} / span ${getNumOfCols}` }}>
                        <small className="chat-message-time">
                            {moment(message.sendTime).format('hh:mm')}
                        </small>
                        {index === messagesLength - 1 && message.fromUid === user?._id && (
                            <small>{t(message.status)}</small>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="chat-message-content">
                        {message.files && message.files.length > 0 && (
                            <div
                                className="chat-message-text-image"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${getNumOfCols}, auto)`,
                                    marginBottom: '0.5rem',
                                    gap: '0.25rem',
                                }}>
                                {message.files.map((file, index) => (
                                    <FileMessageItem
                                        key={index}
                                        file={file}
                                        showControllers={getNumOfCols === 1}
                                        inGrid={getNumOfCols > 1}
                                        style={{
                                            objectFit: getNumOfCols > 1 ? 'cover' : 'contain',
                                        }}
                                        onLoad={onLoad}
                                        onClick={onClick}
                                    />
                                ))}
                            </div>
                        )}
                        {highlightWords && highlightWords.length > 0 ? (
                            <Highlighter
                                searchWords={highlightWords}
                                textToHighlight={message.content}
                                sanitize={(text) =>
                                    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                                }
                                autoEscape
                            />
                        ) : (
                            message.content
                        )}
                    </div>
                    <div>
                        <small className="chat-message-time">
                            {moment(message.sendTime).format('hh:mm')}
                        </small>
                        {index === messagesLength - 1 && message.fromUid === user?._id && (
                            <small>{t(message.status)}</small>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default MessageItem;
