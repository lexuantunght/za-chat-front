import { authenticationRepository } from '../../../data/repository/AuthenticationRepositoryImpl';
import { RegisterData } from '../../model/RegisterData';
import { UserData } from '../../model/UserData';
import { AuthenticationRepository } from '../../repository/AuthenticationRepository';

export interface RegisterUseCase {
    invoke: (data: RegisterData) => Promise<UserData>;
}

export class Register implements RegisterUseCase {
    private authenticationRepo: AuthenticationRepository;
    constructor(_authenticationRepo?: AuthenticationRepository) {
        if (!_authenticationRepo) {
            this.authenticationRepo = authenticationRepository;
        } else {
            this.authenticationRepo = _authenticationRepo;
        }
    }

    async invoke(data: RegisterData) {
        return this.authenticationRepo.register(data);
    }
}
