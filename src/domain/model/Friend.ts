import { UserData } from './UserData';

export interface Friend {
    _id: string;
    user: UserData;
    friendSinceTime: Date;
    userId: string;
}
