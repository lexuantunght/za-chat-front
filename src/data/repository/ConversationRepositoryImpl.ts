import { ConversationRepository } from '../../domain/repository/ConversationRepository';
import { conversationDataSource } from '../dataSource/API/ConversationAPIDataSource';
import ConversationDataSource from '../dataSource/ConversationDataSource';

export class ConversationRepositoryImpl implements ConversationRepository {
    private dataSource: ConversationDataSource;

    constructor(_dataSource?: ConversationDataSource) {
        if (!_dataSource) {
            this.dataSource = conversationDataSource;
        } else {
            this.dataSource = _dataSource;
        }
    }

    async getConversations() {
        return this.dataSource.getConversations();
    }
}

export const conversationRepository = new ConversationRepositoryImpl();
