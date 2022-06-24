import { UserDataAPIEntity } from './UserDataAPIEntity';

export interface FriendAPIEntity {
    _id: string;
    user: UserDataAPIEntity;
    friendSinceTime: Date;
    userId: string;
}
