import { UserData } from './UserData';

export interface Conversation {
    _id: string;
    userId?: string;
    user: UserData;
    lastMessage?: string;
    lastMessageType?: 'text' | 'file' | 'image';
    lastMessageTime?: number;
    lastMessageFromUid?: string;
    lastMessageStatus?: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
    isGroup?: boolean;
    groupId?: string;
}
