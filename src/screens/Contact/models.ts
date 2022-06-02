export type FriendStatus = 'requested' | 'friend' | 'waiting';

export type Contact = {
    _id: string;
    name: string;
    avatar?: string;
    phoneNumber: string;
    conversationId?: string;
    friendStatus?: FriendStatus;
};
