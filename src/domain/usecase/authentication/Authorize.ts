import { AuthenticationRepositoryImpl } from '../../../data/repository/AuthenticationRepositoryImpl';
import { LoginData } from '../../model/LoginData';
import { UserData } from '../../model/UserData';
import { AuthenticationRepository } from '../../repository/AuthenticationRepository';

export interface AuthorizeUseCase {
    invoke: (data: LoginData) => Promise<UserData>;
}

export class Authorize implements AuthorizeUseCase {
    private authenticationRepo: AuthenticationRepository;
    constructor(_authenticationRepo?: AuthenticationRepository) {
        if (!_authenticationRepo) {
            this.authenticationRepo = new AuthenticationRepositoryImpl();
        } else {
            this.authenticationRepo = _authenticationRepo;
        }
    }

    async invoke() {
        return this.authenticationRepo.authorize();
    }
}
