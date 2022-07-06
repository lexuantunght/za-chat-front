import { UserDataAPIEntity } from './UserDataAPIEntity';

export interface FriendRequestAPIEntity {
    _id: string;
    fromUid: string;
    fromUser: UserDataAPIEntity;
    requestText?: string;
    requestTime: Date;
}
