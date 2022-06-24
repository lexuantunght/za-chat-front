import { FriendAPIEntity } from './API/entity/FriendAPIEntity';
import { UserDataAPIEntity } from './API/entity/UserDataAPIEntity';

export default interface ContactDataSource {
    getContacts(): Promise<FriendAPIEntity[]>;
    findUsers(keyword: string): Promise<UserDataAPIEntity[]>;
    requestFriend(userId: string): Promise<void>;
    acceptFriend(userId: string): Promise<void>;
    rejectFriend(userId: string): Promise<void>;
    cancelRequest(userId: string): Promise<void>;
    getInvitations(): Promise<FriendAPIEntity[]>;
}
