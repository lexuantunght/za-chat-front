import { PagingData } from '../../../common/types/PagingData';
import { MessageRepositoryImpl } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface GetMessageUseCase {
    invoke: (userId: string, page?: number, limit?: number) => Promise<PagingData<Message>>;
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

    async invoke(userId: string, page?: number, limit?: number) {
        return this.messageRepo.getMessages(userId, page, limit);
    }
}
