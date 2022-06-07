import { Contact } from '../../domain/model/Contact';

export default interface ConversationDataSource {
    getContacts(): Promise<Contact[]>;
    requestFriend(userId: string): Promise<void>;
    acceptFriend(userId: string): Promise<void>;
    rejectFriend(userId: string): Promise<void>;
    cancelRequest(userId: string): Promise<void>;
    getInvitations(): Promise<Contact[]>;
}
