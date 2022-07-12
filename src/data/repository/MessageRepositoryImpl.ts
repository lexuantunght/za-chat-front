import { PagingData } from '../../common/types/PagingData';
import { Message } from '../../domain/model/Message';
import { MessageRepository } from '../../domain/repository/MessageRepository';
import { messageDataSource } from '../dataSource/API/MessageAPIDataSource';
import MessageDataSource from '../dataSource/MessageDataSource';

export class MessageRepositoryImpl implements MessageRepository {
    private dataSource: MessageDataSource;

    constructor(_dataSource?: MessageDataSource) {
        if (!_dataSource) {
            this.dataSource = messageDataSource;
        } else {
            this.dataSource = _dataSource;
        }
    }

    async getMessages(
        conversationId: string,
        fromSendTime?: number,
        limit?: number,
        later?: boolean
    ) {
        return this.dataSource.getMessages(conversationId, fromSendTime, limit, later);
    }

    async navigateMessage(
        conversationId: string,
        fromSendTime: number,
        msgId: string,
        limit?: number
    ) {
        return this.dataSource.navigateMessage(conversationId, fromSendTime, msgId, limit);
    }

    async sendMessage(message: Message, updateCb?: (msg: Message) => void) {
        return this.dataSource.sendMessage(message, updateCb);
    }

    searchMessages(
        keyword: string,
        conversationId?: string,
        callback?: (result: PagingData<Message>, subkeys?: string[]) => void
    ) {
        this.dataSource.searchMessages(keyword, conversationId, callback);
    }

    updateMessage(message: Message) {
        this.dataSource.updateMessage(message);
    }
}

export const messageRepository = new MessageRepositoryImpl();
