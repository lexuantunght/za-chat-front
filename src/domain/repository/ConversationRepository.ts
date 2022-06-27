import { PagingData } from '../../common/types/PagingData';
import { Conversation } from '../model/Conversation';

export interface ConversationRepository {
    getConversations(): Promise<PagingData<Conversation>>;
}
