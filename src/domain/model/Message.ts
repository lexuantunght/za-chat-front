import { FileData } from './FileData';

export interface Message {
    _id: string;
    content: string;
    files?: FileData[];
    sendTime: number;
    fromUid: string;
    toUid: string;
    userId?: string;
    seen?: string[];
    status: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
    type: 'text' | 'image' | 'file';
}
