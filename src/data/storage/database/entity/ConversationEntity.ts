export interface ConversationEntity {
    _id: string;
    userId?: string;
    lastMessage: string;
    lastMessageType: 'file' | 'text';
    lastMessageTime: number;
    lastMessageFromUid: string;
    isGroup?: boolean;
    groupId?: string;
}
