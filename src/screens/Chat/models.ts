export interface Message {
    _id?: string;
    content?: string;
    created_at?: Date;
    conversationId: string;
    userId: string;
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
    created_at?: Date;
    updated_at?: Date;
}
