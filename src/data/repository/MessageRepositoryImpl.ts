import { Message } from '../../domain/model/Message';
import { MessageRepository } from '../../domain/repository/MessageRepository';
import MessageAPIDataSourceImpl from '../dataSource/API/MessageAPIDataSource';
import MessageDataSource from '../dataSource/MessageDataSource';
import MessageQueries from '../storage/database/query/MessageQueries';

export class MessageRepositoryImpl implements MessageRepository {
    private dataSource: MessageDataSource;

    constructor(_dataSource?: MessageDataSource) {
        if (!_dataSource) {
            this.dataSource = new MessageAPIDataSourceImpl(new MessageQueries());
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

    async sendMessage(message: Message) {
        return this.dataSource.sendMessage(message);
    }

    async searchMessages(keyword: string, conversationId?: string) {
        return this.dataSource.searchMessages(keyword, conversationId);
    }
}
