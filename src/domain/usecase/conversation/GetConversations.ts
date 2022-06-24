import { PagingData } from '../../../common/types/PagingData';
import { ConversationRepositoryImpl } from '../../../data/repository/ConversationRepositoryImpl';
import { Conversation } from '../../model/Conversation';
import { ConversationRepository } from '../../repository/ConversationRepository';

export interface GetConversationUseCase {
    invoke: () => Promise<PagingData<Conversation>>;
}

export class GetConversations implements GetConversationUseCase {
    private conversationRepo: ConversationRepository;
    constructor(_conversationRepo?: ConversationRepository) {
        if (!_conversationRepo) {
            this.conversationRepo = new ConversationRepositoryImpl();
        } else {
            this.conversationRepo = _conversationRepo;
        }
    }

    async invoke() {
        return this.conversationRepo.getConversations();
    }
}
