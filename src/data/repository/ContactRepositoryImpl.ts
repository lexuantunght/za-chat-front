import { ContactRepository } from '../../domain/repository/ContactRepository';
import { contactDataSource } from '../dataSource/API/ContactAPIDataSource';
import ContactDataSource from '../dataSource/ContactDataSource';

export class ContactRepositoryImpl implements ContactRepository {
    private dataSource: ContactDataSource;

    constructor(_dataSource?: ContactDataSource) {
        if (!_dataSource) {
            this.dataSource = contactDataSource;
        } else {
            this.dataSource = _dataSource;
        }
    }

    async getFriends() {
        return this.dataSource.getFriends();
    }

    async findUsers(keyword: string) {
        return this.dataSource.findUsers(keyword);
    }

    async acceptFriend(userId: string) {
        return this.dataSource.acceptFriend(userId);
    }

    async rejectFriend(userId: string) {
        return this.dataSource.rejectFriend(userId);
    }

    async requestFriend(userId: string) {
        return this.dataSource.requestFriend(userId);
    }

    async cancelRequest(userId: string) {
        return this.dataSource.cancelRequest(userId);
    }

    async getInvitations() {
        return this.dataSource.getInvitations();
    }

    async getSuggestContacts() {
        return this.dataSource.getSuggestContacts();
    }
}

export const contactRepository = new ContactRepositoryImpl();
