import { PagingData } from '../../../common/types/PagingData';
import { messageRepository } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface GetMessageUseCase {
    invoke: (
        conversationId: string,
        fromSendTime?: number,
        limit?: number,
        later?: boolean
    ) => Promise<PagingData<Message>>;
}

export class GetMessages implements GetMessageUseCase {
    private messageRepo: MessageRepository;
    constructor(_messageRepo?: MessageRepository) {
        if (!_messageRepo) {
            this.messageRepo = messageRepository;
        } else {
            this.messageRepo = _messageRepo;
        }
    }

    async invoke(conversationId: string, fromSendTime?: number, limit?: number, later?: boolean) {
        return this.messageRepo.getMessages(conversationId, fromSendTime, limit, later);
    }
}
