import { contactRepository } from '../../../data/repository/ContactRepositoryImpl';
import { ContactRepository } from '../../repository/ContactRepository';

export interface CancelRequestUseCase {
    invoke: (userId: string) => Promise<void>;
}

export class CancelRequest implements CancelRequestUseCase {
    private contactRepo: ContactRepository;
    constructor(_contactRepo?: ContactRepository) {
        if (!_contactRepo) {
            this.contactRepo = contactRepository;
        } else {
            this.contactRepo = _contactRepo;
        }
    }

    async invoke(userId: string) {
        return this.contactRepo.cancelRequest(userId);
    }
}
