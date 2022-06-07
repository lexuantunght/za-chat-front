import appConfig from '../../../utils/app/appConfig';
import Network from '../../networking/Network';
import ContactDataSource from '../ContactDataSource';
import { ContactAPIEntity } from './entity/ContactAPIEntity';

export default class ContactAPIDataSourceImpl implements ContactDataSource {
    async getContacts() {
        const response = await Network.getInstance().getHelper<ContactAPIEntity[]>(
            `${appConfig.baseUrl}/contacts`
        );
        return response.data;
    }
    async findContacts(keyword: string) {
        const response = await Network.getInstance().getHelper<ContactAPIEntity[]>(
            `${appConfig.baseUrl}/contacts/find?keyword=${keyword}`
        );
        return response.data;
    }
    async requestFriend(userId: string) {
        await Network.getInstance().postHelper(`${appConfig.baseUrl}/contacts/request`, {
            userId,
        });
    }
    async acceptFriend(userId: string) {
        await Network.getInstance().postHelper(`${appConfig.baseUrl}/contacts/add`, {
            userId,
        });
    }
    async rejectFriend(userId: string) {
        await Network.getInstance().postHelper(`${appConfig.baseUrl}/contacts/reject`, {
            userId,
        });
    }
    async cancelRequest(userId: string) {
        await Network.getInstance().postHelper(`${appConfig.baseUrl}/contacts/cancel-request`, {
            userId,
        });
    }
    async getInvitations() {
        const response = await Network.getInstance().getHelper<ContactAPIEntity[]>(
            `${appConfig.baseUrl}/contacts/invitations`
        );
        return response.data;
    }
}
