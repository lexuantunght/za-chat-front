import { PagingData } from '../../common/types/PagingData';
import { Message } from '../../domain/model/Message';
import { MessageEntity } from '../storage/database/entity/MessageEntity';
import { MessageAPIEntity } from './API/entity/MessageAPIEntity';

export default interface MessageDataSource {
    getMessages(
        conversationId: string,
        fromSendTime?: number,
        limit?: number,
        later?: boolean
    ): Promise<PagingData<MessageAPIEntity>>;
    navigateMessage(
        conversationId: string,
        fromSendTime: number,
        msgId: string,
        limit?: number
    ): Promise<PagingData<MessageAPIEntity>>;
    sendMessage(message: Message): Promise<void>;
    searchMessages(keyword: string, conversationId?: string): Promise<PagingData<MessageEntity>>;
}
