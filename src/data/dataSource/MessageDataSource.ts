import { Message } from '../../domain/model/Message';

export default interface MessageDataSource {
    getMessages(conversationId: string): Promise<Message[]>;
    sendMessage(message: Message): Promise<void>;
}
