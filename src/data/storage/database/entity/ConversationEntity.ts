import { UserInfoEntity } from './UserInfoEntity';

export interface ConversationEntity {
    _id: string;
    userId?: string;
    user: UserInfoEntity;
    lastMessage: string;
    lastMessageType: 'file' | 'text' | 'image';
    lastMessageTime: number;
    lastMessageFromUid: string;
    lastMessageStatus: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
    isGroup?: boolean;
    groupId?: string;
}
