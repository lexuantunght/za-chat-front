import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface GetMessageUseCase {
    invoke: () => Promise<Message[]>;
}

export class GetMessages implements GetMessageUseCase {
    private messageRepo: MessageRepository;
    constructor(_messageRepo: MessageRepository) {
        this.messageRepo = _messageRepo;
    }

    async invoke() {
        return this.messageRepo.getMessages();
    }
}
