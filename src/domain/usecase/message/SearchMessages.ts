import { PagingData } from '../../../common/types/PagingData';
import { MessageRepositoryImpl } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface SearchMessagesUseCase {
    invoke: (keyword: string, conversationId?: string) => void;
}

export class SearchMessages implements SearchMessagesUseCase {
    private messageRepo: MessageRepository;
    constructor(_messageRepo?: MessageRepository) {
        if (!_messageRepo) {
            this.messageRepo = new MessageRepositoryImpl();
        } else {
            this.messageRepo = _messageRepo;
        }
    }

    invoke(
        keyword: string,
        conversationId?: string,
        callback?: (result: PagingData<Message>) => void
    ) {
        this.messageRepo.searchMessages(keyword, conversationId, callback);
    }
}
