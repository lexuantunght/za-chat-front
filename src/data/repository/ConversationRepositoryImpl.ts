import { ConversationRepository } from '../../domain/repository/ConversationRepository';
import ConversationAPIDataSourceImpl from '../dataSource/API/ConversationAPIDataSource';
import ConversationDataSource from '../dataSource/ConversationDataSource';

export class ConversationRepositoryImpl implements ConversationRepository {
    dataSource: ConversationDataSource;

    constructor(_datasource?: ConversationDataSource) {
        if (!_datasource) {
            this.dataSource = new ConversationAPIDataSourceImpl();
        } else {
            this.dataSource = _datasource;
        }
    }

    async getConversations() {
        return this.dataSource.getConversations();
    }
}
