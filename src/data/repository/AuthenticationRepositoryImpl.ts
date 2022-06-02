import { LoginData } from '../../domain/model/LoginData';
import { RegisterData } from '../../domain/model/RegisterData';
import { AuthenticationRepository } from '../../domain/repository/AuthenticationRepository';
import AuthenticationAPIDataSourceImpl from '../dataSource/API/AuthenticationAPIDataSource';
import AuthenticationDataSource from '../dataSource/AuthenticationDataSource';

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
    dataSource: AuthenticationDataSource;

    constructor(_datasource?: AuthenticationDataSource) {
        if (!_datasource) {
            this.dataSource = new AuthenticationAPIDataSourceImpl();
        } else {
            this.dataSource = _datasource;
        }
    }

    async login(data: LoginData) {
        return this.dataSource.login(data);
    }

    async register(data: RegisterData) {
        return this.dataSource.register(data);
    }
}
