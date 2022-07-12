import { PagingData } from '../../common/types/PagingData';
import { Message } from '../../domain/model/Message';
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
    sendMessage(message: Message, updateCb?: (msg: MessageAPIEntity) => void): Promise<void>;
    searchMessages(
        keyword: string,
        conversationId?: string,
        callback?: (result: PagingData<MessageAPIEntity>, subkeys?: string[]) => void
    ): void;
    updateMessage(message: Message): void;
}
