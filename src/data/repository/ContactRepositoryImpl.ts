import { ContactRepository } from '../../domain/repository/ContactRepository';
import ContactAPIDataSourceImpl from '../dataSource/API/ContactAPIDataSource';
import ContactDataSource from '../dataSource/ContactDataSource';

export class ContactRepositoryImpl implements ContactRepository {
    dataSource: ContactDataSource;

    constructor(_datasource?: ContactDataSource) {
        if (!_datasource) {
            this.dataSource = new ContactAPIDataSourceImpl();
        } else {
            this.dataSource = _datasource;
        }
    }

    async getContacts() {
        return this.dataSource.getContacts();
    }

    async findContacts(keyword: string) {
        return this.dataSource.findContacts(keyword);
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
}
