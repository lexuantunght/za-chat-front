import { PagingData } from '../../common/types/PagingData';
import { Message } from '../model/Message';

export interface MessageRepository {
    getMessages(
        conversationId: string,
        fromSendTime?: Date,
        limit?: number
    ): Promise<PagingData<Message>>;
    sendMessage(message: Message): Promise<void>;
    searchMessages(keyword: string): Promise<PagingData<Message>>;
}
