import { contactRepository } from '../../../data/repository/ContactRepositoryImpl';
import { ContactRepository } from '../../repository/ContactRepository';

export interface RejectFriendUseCase {
    invoke: (userId: string) => Promise<void>;
}

export class RejectFriend implements RejectFriendUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = contactRepository;
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke(userId: string) {
        return this.contactRepo.rejectFriend(userId);
    }
}
