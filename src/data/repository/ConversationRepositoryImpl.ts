import { ConversationRepository } from '../../domain/repository/ConversationRepository';
import { conversationDataSource } from '../dataSource/API/ConversationAPIDataSource';
import ConversationDataSource from '../dataSource/ConversationDataSource';

export class ConversationRepositoryImpl implements ConversationRepository {
    private dataSource: ConversationDataSource;

    constructor() {
        this.dataSource = conversationDataSource;
    }

    async getConversations() {
        return this.dataSource.getConversations();
    }
}

export const conversationRepository = new ConversationRepositoryImpl();
