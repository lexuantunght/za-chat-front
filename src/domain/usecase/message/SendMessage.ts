import { messageRepository } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface SendMessageUseCase {
    invoke: (message: Message, updateCb?: (msg: Message) => void) => Promise<void>;
}

export class SendMessage implements SendMessageUseCase {
    private messageRepo: MessageRepository;
    constructor(_messageRepo?: MessageRepository) {
        if (!_messageRepo) {
            this.messageRepo = messageRepository;
        } else {
            this.messageRepo = _messageRepo;
        }
    }

    async invoke(message: Message, updateCb?: (msg: Message) => void) {
        return this.messageRepo.sendMessage(message, updateCb);
    }
}
