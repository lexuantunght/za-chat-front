import { LoginData } from '../model/LoginData';
import { RegisterData } from '../model/RegisterData';
import { UserData } from '../model/UserData';

export interface AuthenticationRepository {
    login(data: LoginData): Promise<UserData>;
    register(data: RegisterData): Promise<UserData>;
    authorize(): Promise<UserData>;
}
