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

    async getMessages(conversationId: string, fromSendTime?: Date, limit?: number) {
        return this.dataSource.getMessages(conversationId, fromSendTime, limit);
    }

    async sendMessage(message: Message) {
        return this.dataSource.sendMessage(message);
    }

    async searchMessages(keyword: string) {
        return this.dataSource.searchMessages(keyword);
    }
}
