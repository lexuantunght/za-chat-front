import { PagingData } from '../../../common/types/PagingData';
import { messageRepository } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface SearchMessagesUseCase {
    invoke: (
        keyword: string,
        conversationId?: string,
        callback?: (result: PagingData<Message>, subkeys?: string[]) => void
    ) => void;
}

export class SearchMessages implements SearchMessagesUseCase {
    private messageRepo: MessageRepository;
    constructor(_messageRepo?: MessageRepository) {
        if (!_messageRepo) {
            this.messageRepo = messageRepository;
        } else {
            this.messageRepo = _messageRepo;
        }
    }

    invoke(
        keyword: string,
        conversationId?: string,
        callback?: (result: PagingData<Message>, subkeys?: string[]) => void
    ) {
        this.messageRepo.searchMessages(keyword, conversationId, callback);
    }
}
