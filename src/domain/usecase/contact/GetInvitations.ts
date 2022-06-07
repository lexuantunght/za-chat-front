import { ContactRepositoryImpl } from '../../../data/repository/ContactRepositoryImpl';
import { Contact } from '../../model/Contact';
import { ContactRepository } from '../../repository/ContactRepository';

export interface GetInvitationsUseCase {
    invoke: () => Promise<Contact[]>;
}

export class GetInvitations implements GetInvitationsUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = new ContactRepositoryImpl();
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke() {
        return this.contactRepo.getInvitations();
    }
}
