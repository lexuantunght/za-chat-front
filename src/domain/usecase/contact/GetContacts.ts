import { ContactRepositoryImpl } from '../../../data/repository/ContactRepositoryImpl';
import { Friend } from '../../model/Friend';
import { ContactRepository } from '../../repository/ContactRepository';

export interface GetContactsUseCase {
    invoke: () => Promise<Friend[]>;
}

export class GetContacts implements GetContactsUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = new ContactRepositoryImpl();
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke() {
        return this.contactRepo.getContacts();
    }
}
