import { FileDataAPIEntity } from './FileDataAPIEntity';

export interface MessageAPIEntity {
    _id: string;
    content: string;
    sendTime: Date;
    files: FileDataAPIEntity[];
    conversationId: string;
    fromUid: string;
    toUid: string;
    seen: string[];
    status: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
    type: 'text' | 'file' | 'image';
}
