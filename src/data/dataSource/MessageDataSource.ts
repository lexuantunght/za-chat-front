import { Message } from '../../domain/model/Message';
import { MessageAPIEntity } from './API/entity/MessageAPIEntity';

export default interface MessageDataSource {
    getMessages(conversationId: string, page?: number, limit?: number): Promise<MessageAPIEntity[]>;
    sendMessage(message: Message): Promise<void>;
}
