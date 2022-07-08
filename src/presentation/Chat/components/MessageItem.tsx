import React from 'react';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { Message } from '../../../domain/model/Message';
import { UserData } from '../../../domain/model/UserData';
import Image from '../../../common/components/Image';
import { FileData } from '../../../domain/model/FileData';
import Video from '../../../common/components/Video';
import fileHolder from '../../../common/resources/file-holder.png';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import { openSaveDialog } from '../../../utils/app/eventHandler';

type MessageItemProps = {
    message: Message;
    index: number;
    user?: UserData;
    t: CallableFunction;
    conversationAvatar?: string;
    messagesLength: number;
    showAvatar?: boolean;
    onLoad?: () => void;
    onClick?: (file: FileData, index: number) => void;
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

const getFileSizeDisplay = (fileSize?: number) => {
    if (!fileSize) {
        return null;
    }
    const gbUnit = 1024 * 1024 * 1024;
    const mbUnit = 1024 * 1024;
    const kbUnit = 1024;
    if (fileSize >= gbUnit) {
        return `${(fileSize / gbUnit).toFixed(2)} GB`;
    }
    if (fileSize >= mbUnit) {
        return `${(fileSize / mbUnit).toFixed(2)} MB`;
    }
    if (fileSize >= kbUnit) {
        return `${(fileSize / kbUnit).toFixed(2)} KB`;
    }
    return `${fileSize} B`;
};

const FileMessageItem = ({
    file,
    style,
    onLoad,
    onClick,
    inGrid,
    showControllers = true,
}: FileMessageItemProp) => {
    const handleDownload = () => {
        openSaveDialog({
            url: file.url,
            name: file.name,
            type: file.name?.substring(file.name.lastIndexOf('.') + 1),
        });
    };

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
    if (file.type?.startsWith('image/')) {
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
    }
    return (
        <div className="message-other-file">
            <div className="message-other-file-logo">
                <img src={fileHolder} />
                <div>{file.name?.substring(file.name?.lastIndexOf('.') + 1).substring(0, 3)}</div>
            </div>
            <div className="message-other-file-info">
                <div className="message-other-file-name">{file.name}</div>
                <div className="message-other-file-size">{getFileSizeDisplay(file.size)}</div>
            </div>
            <div>
                <Button variant="text" onClick={handleDownload}>
                    <Icon name="download" />
                </Button>
            </div>
        </div>
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
                    className={
                        message.files[0].type?.startsWith('image/') ||
                        message.files[0].type?.startsWith('video/')
                            ? 'chat-message-image-only'
                            : 'chat-message-other-file-only'
                    }
                    style={{ gridTemplateColumns: `repeat(${getNumOfCols}, minmax(0, 1fr))` }}>
                    {message.files.map((file, index) => (
                        <FileMessageItem
                            key={index}
                            file={file}
                            showControllers={getNumOfCols === 1}
                            inGrid={getNumOfCols > 1}
                            style={{ objectFit: getNumOfCols > 1 ? 'cover' : 'contain' }}
                            onLoad={onLoad}
                            onClick={(f) => onClick?.(f, index)}
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
                                        onClick={(f) => onClick?.(f, index)}
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
