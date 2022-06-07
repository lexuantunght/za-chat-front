import { LoginData } from '../../domain/model/LoginData';
import { RegisterData } from '../../domain/model/RegisterData';
import { UserData } from '../../domain/model/UserData';

export default interface AuthenticationDataSource {
    login(data: LoginData): Promise<UserData>;
    register(data: RegisterData): Promise<UserData>;
    authorize(): Promise<UserData>;
    connectSocket(): void;
    disconnectSocket(): void;
}
