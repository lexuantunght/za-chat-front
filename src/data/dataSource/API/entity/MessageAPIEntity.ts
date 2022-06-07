export interface MessageAPIEntity {
    _id: string;
    content: string;
    created_at: Date;
    conversationId: string;
    userId: string;
    toUserId: string;
    seen: string[];
    status: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
}
