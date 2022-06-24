import { PagingData } from '../../common/types/PagingData';
import { ConversationAPIEntity } from './API/entity/ConversationAPIEntity';

export default interface ConversationDataSource {
    getConversations(): Promise<PagingData<ConversationAPIEntity>>;
}
