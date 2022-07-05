import { FileDataAPIEntity } from './FileDataAPIEntity';

export interface MessageAPIEntity {
    _id: string;
    content: string;
    sendTime: number;
    files: FileDataAPIEntity[];
    conversationId: string;
    fromUid: string;
    toUid: string;
    userId?: string;
    seen: string[];
    status: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
    type: 'text' | 'file' | 'image';
}
