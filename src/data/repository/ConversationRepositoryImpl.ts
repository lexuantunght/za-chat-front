import { ConversationRepository } from '../../domain/repository/ConversationRepository';
import ConversationAPIDataSourceImpl from '../dataSource/API/ConversationAPIDataSource';
import ConversationDataSource from '../dataSource/ConversationDataSource';

export class ConversationRepositoryImpl implements ConversationRepository {
    dataSource: ConversationDataSource;

    constructor(_dataSource?: ConversationDataSource) {
        if (!_dataSource) {
            this.dataSource = new ConversationAPIDataSourceImpl();
        } else {
            this.dataSource = _dataSource;
        }
    }

    async getConversations() {
        return this.dataSource.getConversations();
    }
}
