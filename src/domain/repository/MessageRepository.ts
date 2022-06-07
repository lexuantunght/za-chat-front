import { Message } from '../model/Message';

export interface MessageRepository {
    getMessages(conversationId: string): Promise<Message[]>;
    sendMessage(message: Message): Promise<void>;
}
