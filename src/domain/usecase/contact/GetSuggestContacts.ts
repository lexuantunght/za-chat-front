import { contactRepository } from '../../../data/repository/ContactRepositoryImpl';
import { UserData } from '../../model/UserData';
import { ContactRepository } from '../../repository/ContactRepository';

export interface GetSuggestContactsUseCase {
    invoke: () => Promise<UserData[]>;
}

export class GetSuggestContacts implements GetSuggestContactsUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = contactRepository;
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke() {
        return this.contactRepo.getSuggestContacts();
    }
}
