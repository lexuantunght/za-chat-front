import { FriendStatus } from '../../../../common/types/FriendStatus';

export interface ContactAPIEntity {
    _id: string;
    name: string;
    avatar?: string;
    phoneNumber: string;
    conversationId?: string;
    friendStatus: FriendStatus;
}
