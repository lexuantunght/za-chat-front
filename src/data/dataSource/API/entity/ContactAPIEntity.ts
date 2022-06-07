export interface ContactAPIEntity {
    _id: string;
    name: string;
    avatar?: string;
    phoneNumber: string;
    conversationId?: string;
    friendStatus?: 'requested' | 'friend' | 'waiting';
}
