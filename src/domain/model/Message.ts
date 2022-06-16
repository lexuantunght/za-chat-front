import { FileData } from './FileData';

export interface Message {
    _id?: string;
    content: string;
    files?: FileData[];
    created_at: Date;
    conversationId: string;
    userId: string;
    toUserId: string;
    seen?: string[];
    status: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
}
