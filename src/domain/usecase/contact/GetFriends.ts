import { contactRepository } from '../../../data/repository/ContactRepositoryImpl';
import { Friend } from '../../model/Friend';
import { ContactRepository } from '../../repository/ContactRepository';

export interface GetFriendsUseCase {
    invoke: () => Promise<Friend[]>;
}

export class GetFriends implements GetFriendsUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = contactRepository;
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke() {
        return this.contactRepo.getFriends();
    }
}
