export type Message = {
    content?: string;
    created_at: Date;
    chatItemId: string;
    userId: string;
};

export type ChatItem = {
    _id: string;
    avatar?: string;
    name?: string;
    latestMessage?: Message;
    messages?: Message[];
};
