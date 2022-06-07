import { Message } from '../../domain/model/Message';
import { MessageRepository } from '../../domain/repository/MessageRepository';
import MessageAPIDataSourceImpl from '../dataSource/API/MessageAPIDataSource';
import MessageDataSource from '../dataSource/MessageDataSource';

export class MessageRepositoryImpl implements MessageRepository {
    dataSource: MessageDataSource;

    constructor(_datasource?: MessageDataSource) {
        if (!_datasource) {
            this.dataSource = new MessageAPIDataSourceImpl();
        } else {
            this.dataSource = _datasource;
        }
    }

    async getMessages(conversationId: string) {
        return this.dataSource.getMessages(conversationId);
    }

    async sendMessage(message: Message) {
        return this.dataSource.sendMessage(message);
    }
}
