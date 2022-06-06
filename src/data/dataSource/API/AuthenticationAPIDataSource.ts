import { LoginData } from '../../../domain/model/LoginData';
import { RegisterData } from '../../../domain/model/RegisterData';
import { UserData } from '../../../domain/model/UserData';
import appConfig from '../../../utils/app/appConfig';
import objectToFormData from '../../../utils/helpers/objectToFormData';
import Network from '../../networking/Network';
import AuthenticationDataSource from '../AuthenticationDataSource';
import { UserDataAPIEntity } from './entity/UserDataAPIEntity';

export default class AuthenticationAPIDataSourceImpl implements AuthenticationDataSource {
    async login(data: LoginData) {
        const response = await Network.getInstance().postHelper<UserDataAPIEntity>(
            `${appConfig.baseUrl}/users/signin`,
            { ...data }
        );
        return response.data;
    }
    async register(data: RegisterData) {
        const formData = new FormData();
        const response = await Network.getInstance().postHelper<UserDataAPIEntity>(
            `${appConfig.baseUrl}/users/signup`,
            formData
        );
        return response.data;
    }
    async authorize() {
        const response = await Network.getInstance().getHelper<UserDataAPIEntity>(
            `${appConfig.baseUrl}/users/current`
        );
        return response.data;
    }
}
