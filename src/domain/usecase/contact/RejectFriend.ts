import { ContactRepositoryImpl } from '../../../data/repository/ContactRepositoryImpl';
import { ContactRepository } from '../../repository/ContactRepository';

export interface RejectFriendUseCase {
    invoke: (userId: string) => Promise<void>;
}

export class RejectFriend implements RejectFriendUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = new ContactRepositoryImpl();
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke(userId: string) {
        return this.contactRepo.rejectFriend(userId);
    }
}
