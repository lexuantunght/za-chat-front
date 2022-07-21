import { FriendAPIEntity } from './API/entity/FriendAPIEntity';
import { FriendRequestAPIEntity } from './API/entity/FriendRequestAPIEntity';
import { UserDataAPIEntity } from './API/entity/UserDataAPIEntity';

export default interface ContactDataSource {
    getFriends(): Promise<FriendAPIEntity[]>;
    findUsers(keyword: string): Promise<UserDataAPIEntity[]>;
    requestFriend(userId: string): Promise<void>;
    acceptFriend(userId: string): Promise<void>;
    rejectFriend(userId: string): Promise<void>;
    cancelRequest(userId: string): Promise<void>;
    getInvitations(): Promise<FriendRequestAPIEntity[]>;
    getSuggestContacts(): Promise<UserDataAPIEntity[]>;
}
