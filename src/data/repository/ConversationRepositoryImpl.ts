import { ConversationRepository } from '../../domain/repository/ConversationRepository';
import ConversationAPIDataSourceImpl from '../dataSource/API/ConversationAPIDataSource';
import ConversationDataSource from '../dataSource/ConversationDataSource';
import ConversationQueries from '../storage/database/query/ConversationQueries';

export class ConversationRepositoryImpl implements ConversationRepository {
    private dataSource: ConversationDataSource;

    constructor(_dataSource?: ConversationDataSource) {
        if (!_dataSource) {
            this.dataSource = new ConversationAPIDataSourceImpl(new ConversationQueries());
        } else {
            this.dataSource = _dataSource;
        }
    }

    async getConversations() {
        return this.dataSource.getConversations();
    }
}
