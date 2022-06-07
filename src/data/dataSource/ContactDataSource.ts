import { ContactAPIEntity } from './API/entity/ContactAPIEntity';

export default interface ConversationDataSource {
    getContacts(): Promise<ContactAPIEntity[]>;
    findContacts(keyword: string): Promise<ContactAPIEntity[]>;
    requestFriend(userId: string): Promise<void>;
    acceptFriend(userId: string): Promise<void>;
    rejectFriend(userId: string): Promise<void>;
    cancelRequest(userId: string): Promise<void>;
    getInvitations(): Promise<ContactAPIEntity[]>;
}
