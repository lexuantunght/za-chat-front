import { ContactRepositoryImpl } from '../../../data/repository/ContactRepositoryImpl';
import { UserData } from '../../model/UserData';
import { ContactRepository } from '../../repository/ContactRepository';

export interface FindUsersUseCase {
    invoke: (keyword: string) => Promise<UserData[]>;
}

export class FindUsers implements FindUsersUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = new ContactRepositoryImpl();
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke(keyword: string) {
        return this.contactRepo.findUsers(keyword);
    }
}
