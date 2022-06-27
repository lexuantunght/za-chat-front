import { ConversationRepository } from '../../domain/repository/ConversationRepository';
import ConversationAPIDataSourceImpl from '../dataSource/API/ConversationAPIDataSource';
import ConversationDataSource from '../dataSource/ConversationDataSource';
import ConversationQueries from '../storage/database/query/ConversationQueries';

export class ConversationRepositoryImpl implements ConversationRepository {
    private dataSource: ConversationDataSource;
    private clientDataSource: ConversationQueries;

    constructor(_dataSource?: ConversationDataSource) {
        if (!_dataSource) {
            this.dataSource = new ConversationAPIDataSourceImpl();
        } else {
            this.dataSource = _dataSource;
        }
        this.clientDataSource = new ConversationQueries();
    }

    async getConversations() {
        return this.dataSource
            .getConversations()
            .then((pagingData) => {
                this.clientDataSource.addConversations(pagingData.data);
                return pagingData;
            })
            .catch(() => this.clientDataSource.getConversations());
    }
}
