import { PagingData } from '../../../common/types/PagingData';
import { messageRepository } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface NavigateMessageUseCase {
    invoke: (
        conversationId: string,
        fromSendTime: number,
        msgId: string,
        limit?: number
    ) => Promise<PagingData<Message>>;
}

export class NavigateMessage implements NavigateMessageUseCase {
    private messageRepo: MessageRepository;
    constructor() {
        this.messageRepo = messageRepository;
    }

    async invoke(conversationId: string, fromSendTime: number, msgId: string, limit?: number) {
        return this.messageRepo.navigateMessage(conversationId, fromSendTime, msgId, limit);
    }
}
