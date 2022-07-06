import { PagingData } from '../../common/types/PagingData';
import { Message } from '../model/Message';

export interface MessageRepository {
    getMessages(
        conversationId: string,
        fromSendTime?: number,
        limit?: number,
        later?: boolean
    ): Promise<PagingData<Message>>;
    navigateMessage(
        conversationId: string,
        fromSendTime: number,
        msgId: string,
        limit?: number
    ): Promise<PagingData<Message>>;
    sendMessage(message: Message): Promise<void>;
    searchMessages(
        keyword: string,
        conversationId?: string,
        callback?: (result: PagingData<Message>, subkeys?: string[]) => void
    ): void;
}
