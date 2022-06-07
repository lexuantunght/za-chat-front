import { ConversationAPIEntity } from './API/entity/ConversationAPIEntity';

export default interface ConversationDataSource {
    getConversations(): Promise<ConversationAPIEntity[]>;
}
