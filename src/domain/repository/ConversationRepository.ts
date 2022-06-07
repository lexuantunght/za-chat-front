import { Conversation } from '../model/Conversation';

export interface ConversationRepository {
    getConversations(): Promise<Conversation[]>;
}
