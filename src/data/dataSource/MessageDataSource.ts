import { PagingData } from '../../common/types/PagingData';
import { Message } from '../../domain/model/Message';
import { MessageAPIEntity } from './API/entity/MessageAPIEntity';

export default interface MessageDataSource {
    getMessages(
        conversationId: string,
        fromSendTime?: Date,
        limit?: number
    ): Promise<PagingData<MessageAPIEntity>>;
    sendMessage(message: Message): Promise<void>;
}
