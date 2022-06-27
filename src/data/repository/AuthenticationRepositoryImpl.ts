import { LoginData } from '../../domain/model/LoginData';
import { RegisterData } from '../../domain/model/RegisterData';
import { AuthenticationRepository } from '../../domain/repository/AuthenticationRepository';
import AuthenticationAPIDataSourceImpl from '../dataSource/API/AuthenticationAPIDataSource';
import AuthenticationDataSource from '../dataSource/AuthenticationDataSource';

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
    private dataSource: AuthenticationDataSource;

    constructor(_dataSource?: AuthenticationDataSource) {
        if (!_dataSource) {
            this.dataSource = new AuthenticationAPIDataSourceImpl();
        } else {
            this.dataSource = _dataSource;
        }
    }

    async login(data: LoginData) {
        return this.dataSource.login(data);
    }

    async register(data: RegisterData) {
        return this.dataSource.register(data);
    }

    async authorize() {
        return this.dataSource.authorize();
    }
}
