import { contactRepository } from '../../../data/repository/ContactRepositoryImpl';
import { FriendRequest } from '../../model/FriendRequest';
import { ContactRepository } from '../../repository/ContactRepository';

export interface GetInvitationsUseCase {
    invoke: () => Promise<FriendRequest[]>;
}

export class GetInvitations implements GetInvitationsUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = contactRepository;
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke() {
        return this.contactRepo.getInvitations();
    }
}
