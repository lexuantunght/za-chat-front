import { UserData } from './UserData';

export interface FriendRequest {
    _id: string;
    fromUid: string;
    fromUser: UserData;
    requestText?: string;
    requestTime: Date;
}
