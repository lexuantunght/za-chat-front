import { PagingData } from '../../common/types/PagingData';
import { Message } from '../../domain/model/Message';
import { MessageEntity } from '../storage/database/entity/MessageEntity';
import { MessageAPIEntity } from './API/entity/MessageAPIEntity';

export default interface MessageDataSource {
    getMessages(
        conversationId: string,
        fromSendTime?: Date,
        limit?: number
    ): Promise<PagingData<MessageAPIEntity>>;
    sendMessage(message: Message): Promise<void>;
    searchMessages(keyword: string): Promise<PagingData<MessageEntity>>;
}
