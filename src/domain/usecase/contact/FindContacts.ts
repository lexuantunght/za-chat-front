import { ContactRepositoryImpl } from '../../../data/repository/ContactRepositoryImpl';
import { Contact } from '../../model/Contact';
import { ContactRepository } from '../../repository/ContactRepository';

export interface FindContactsUseCase {
    invoke: (keyword: string) => Promise<Contact[]>;
}

export class FindContacts implements FindContactsUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = new ContactRepositoryImpl();
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke(keyword: string) {
        return this.contactRepo.findContacts(keyword);
    }
}
