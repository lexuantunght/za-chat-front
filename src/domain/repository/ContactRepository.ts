import { Contact } from '../model/Contact';

export interface ContactRepository {
    getContacts(): Promise<Contact[]>;
    findContacts(keyword: string): Promise<Contact[]>;
    acceptFriend(userId: string): Promise<void>;
    requestFriend(userId: string): Promise<void>;
    rejectFriend(userId: string): Promise<void>;
    cancelRequest(userId: string): Promise<void>;
    getInvitations(): Promise<Contact[]>;
}
