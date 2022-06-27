import { Message } from '../../domain/model/Message';
import { MessageRepository } from '../../domain/repository/MessageRepository';
import MessageAPIDataSourceImpl from '../dataSource/API/MessageAPIDataSource';
import MessageDataSource from '../dataSource/MessageDataSource';
import MessageQueries from '../storage/database/query/MessageQueries';

export class MessageRepositoryImpl implements MessageRepository {
    private dataSource: MessageDataSource;
    private clientDataSource: MessageQueries;

    constructor(_dataSource?: MessageDataSource) {
        if (!_dataSource) {
            this.dataSource = new MessageAPIDataSourceImpl();
        } else {
            this.dataSource = _dataSource;
        }
        this.clientDataSource = new MessageQueries();
    }

    async getMessages(conversationId: string, fromSendTime?: Date, limit?: number) {
        return this.dataSource.getMessages(conversationId, fromSendTime, limit);
    }

    async sendMessage(message: Message) {
        return this.dataSource.sendMessage(message);
    }
}
