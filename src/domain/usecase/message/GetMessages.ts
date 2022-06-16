import { MessageRepositoryImpl } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface GetMessageUseCase {
    invoke: (conversationId: string, page?: number, limit?: number) => Promise<Message[]>;
}

export class GetMessages implements GetMessageUseCase {
    private messageRepo: MessageRepository;
    constructor(_messageRepo?: MessageRepository) {
        if (!_messageRepo) {
            this.messageRepo = new MessageRepositoryImpl();
        } else {
            this.messageRepo = _messageRepo;
        }
    }

    async invoke(conversationId: string, page?: number, limit?: number) {
        return this.messageRepo.getMessages(conversationId, page, limit);
    }
}
