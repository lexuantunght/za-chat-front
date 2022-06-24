import { PagingData } from '../../common/types/PagingData';
import { Message } from '../model/Message';

export interface MessageRepository {
    getMessages(userId: string, page?: number, limit?: number): Promise<PagingData<Message>>;
    sendMessage(message: Message): Promise<void>;
}
