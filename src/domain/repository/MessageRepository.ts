import { Message } from '../model/Message';

export interface MessageRepository {
    getMessages(conversationId: string, page?: number, limit?: number): Promise<Message[]>;
    sendMessage(message: Message): Promise<void>;
}
