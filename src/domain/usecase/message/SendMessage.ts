import { messageRepository } from '../../../data/repository/MessageRepositoryImpl';
import { Message } from '../../model/Message';
import { MessageRepository } from '../../repository/MessageRepository';

export interface SendMessageUseCase {
    invoke: (message: Message) => Promise<void>;
}

export class SendMessage implements SendMessageUseCase {
    private messageRepo: MessageRepository;
    constructor() {
        this.messageRepo = messageRepository;
    }

    async invoke(message: Message) {
        return this.messageRepo.sendMessage(message);
    }
}
