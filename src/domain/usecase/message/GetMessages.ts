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
    constructor() {
        this.messageRepo = messageRepository;
    }

    async invoke(conversationId: string, fromSendTime?: number, limit?: number, later?: boolean) {
        return this.messageRepo.getMessages(conversationId, fromSendTime, limit, later);
    }
}
