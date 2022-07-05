import { PagingData } from '../../../common/types/PagingData';
import { MessageRepositoryImpl } from '../../../data/repository/MessageRepositoryImpl';
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
    constructor(_messageRepo?: MessageRepository) {
        if (!_messageRepo) {
            this.messageRepo = new MessageRepositoryImpl();
        } else {
            this.messageRepo = _messageRepo;
        }
    }

    async invoke(conversationId: string, fromSendTime: number, msgId: string, limit?: number) {
        return this.messageRepo.navigateMessage(conversationId, fromSendTime, msgId, limit);
    }
}
