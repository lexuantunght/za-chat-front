import { UserDataAPIEntity } from './UserDataAPIEntity';

export interface ConversationAPIEntity {
    _id: string;
    userId?: string;
    user: UserDataAPIEntity;
    lastMessage?: string;
    lastMessageType: 'text' | 'file' | 'image';
    lastMessageTime: Date;
    lastMessageFromUid: string;
    lastMessageStatus: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
    isGroup?: boolean;
    groupId?: string;
}
