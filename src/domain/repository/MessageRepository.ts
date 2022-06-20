import { Message } from '../model/Message';

export interface MessageRepository {
    getMessages(
        conversationId: string,
        page?: number,
        limit?: number
    ): Promise<{ messages: Message[]; total: number }>;
    sendMessage(message: Message): Promise<void>;
}
