import { FriendStatus } from '../Contact/models';

export interface Message {
    _id?: string;
    content?: string;
    created_at?: Date;
    conversationId: string;
    userId: string;
    toUserId?: string;
    seen?: string[];
    status: 'sent' | 'received' | 'seen' | 'failed' | 'sending';
}

export interface ChatItem {
    _id: string;
    avatar?: string;
    name?: string;
    users: [
        {
            _id: string;
            name: string;
            avatar: string;
        }
    ];
    latestMessage?: Message;
    friendStatus?: FriendStatus;
    created_at?: Date;
    updated_at?: Date;
}
