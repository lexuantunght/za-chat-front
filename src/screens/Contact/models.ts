export type Contact = {
    _id: string;
    name: string;
    avatar?: string;
    phoneNumber: string;
    conversationId?: string;
    friendStatus?: 'requested' | 'friend';
};
