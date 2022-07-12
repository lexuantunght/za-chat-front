import { messageRepository } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface UpdateMessageUseCase {
    invoke: (message: Message) => void;
}

export class UpdateMessage implements UpdateMessageUseCase {
    private messageRepo: MessageRepository;
    constructor(_messageRepo?: MessageRepository) {
        if (!_messageRepo) {
            this.messageRepo = messageRepository;
        } else {
            this.messageRepo = _messageRepo;
        }
    }

    invoke(message: Message) {
        return this.messageRepo.updateMessage(message);
    }
}
