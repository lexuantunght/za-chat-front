import { FileDataAPIEntity } from '../../../dataSource/API/entity/FileDataAPIEntity';

export interface MessageEntity {
    _id: string;
    fromUid: string;
    toUid: string;
    content: string;
    seen: string[];
    status: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
    files: FileDataAPIEntity[];
    sendTime: Date;
}
