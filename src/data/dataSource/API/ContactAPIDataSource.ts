import appConfig from '../../../utils/app/appConfig';
import Network from '../../networking/Network';
import ContactDataSource from '../ContactDataSource';
import { FriendAPIEntity } from './entity/FriendAPIEntity';
import { FriendRequestAPIEntity } from './entity/FriendRequestAPIEntity';
import { UserDataAPIEntity } from './entity/UserDataAPIEntity';

export class ContactAPIDataSourceImpl implements ContactDataSource {
    async getFriends() {
        const response = await Network.getInstance().getHelper<FriendAPIEntity[]>(
            `${appConfig.baseUrl}/contacts`
        );
        return response.data;
    }
    async findUsers(keyword: string) {
        const response = await Network.getInstance().getHelper<UserDataAPIEntity[]>(
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
        const response = await Network.getInstance().getHelper<FriendRequestAPIEntity[]>(
            `${appConfig.baseUrl}/contacts/invitations`
        );
        return response.data;
    }
    async getSuggestContacts() {
        const response = await Network.getInstance().getHelper<UserDataAPIEntity[]>(
            `${appConfig.baseUrl}/contacts/suggest`
        );
        return response.data;
    }
}

export const contactDataSource = new ContactAPIDataSourceImpl();
