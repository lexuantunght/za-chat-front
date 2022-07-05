import { PagingData } from '../../../common/types/PagingData';
import { conversationRepository } from '../../../data/repository/ConversationRepositoryImpl';
import { Conversation } from '../../model/Conversation';
import { ConversationRepository } from '../../repository/ConversationRepository';

export interface GetConversationUseCase {
    invoke: () => Promise<PagingData<Conversation>>;
}

export class GetConversations implements GetConversationUseCase {
    private conversationRepo: ConversationRepository;
    constructor() {
        this.conversationRepo = conversationRepository;
    }

    async invoke() {
        return this.conversationRepo.getConversations();
    }
}
