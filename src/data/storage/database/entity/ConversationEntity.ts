export interface ConversationEntity {
    _id: string;
    userId?: string;
    lastMessage: string;
    lastMessageType: 'file' | 'text';
    lastMessageTime: Date;
    lastMessageFromUid: string;
    isGroup?: boolean;
    groupId?: string;
}
