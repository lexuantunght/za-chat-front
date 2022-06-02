import { Message } from '../model/Message';

export interface MessageRepository {
    getMessages(): Promise<Message[]>;
    sendMessage(message: Message): Promise<void>;
}
