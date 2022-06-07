import { LoginData } from '../../domain/model/LoginData';
import { RegisterData } from '../../domain/model/RegisterData';
import { UserDataAPIEntity } from './API/entity/UserDataAPIEntity';

export default interface AuthenticationDataSource {
    login(data: LoginData): Promise<UserDataAPIEntity>;
    register(data: RegisterData): Promise<UserDataAPIEntity>;
    authorize(): Promise<UserDataAPIEntity>;
}
