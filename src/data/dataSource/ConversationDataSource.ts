import { Conversation } from '../../domain/model/Conversation';

export default interface ConversationDataSource {
    getConversations(): Promise<Conversation[]>;
}
