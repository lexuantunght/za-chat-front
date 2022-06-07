import { ContactRepositoryImpl } from '../../../data/repository/ContactRepositoryImpl';
import { ContactRepository } from '../../repository/ContactRepository';

export interface AcceptFriendUseCase {
    invoke: (userId: string) => Promise<void>;
}

export class AcceptFriend implements AcceptFriendUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = new ContactRepositoryImpl();
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke(userId: string) {
        return this.contactRepo.acceptFriend(userId);
    }
}
