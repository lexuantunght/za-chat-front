import { Friend } from '../model/Friend';
import { FriendRequest } from '../model/FriendRequest';
import { UserData } from '../model/UserData';

export interface ContactRepository {
    getFriends(): Promise<Friend[]>;
    findUsers(keyword: string): Promise<UserData[]>;
    acceptFriend(userId: string): Promise<void>;
    requestFriend(userId: string): Promise<void>;
    rejectFriend(userId: string): Promise<void>;
    cancelRequest(userId: string): Promise<void>;
    getInvitations(): Promise<FriendRequest[]>;
    getSuggestContacts(): Promise<UserData[]>;
}
