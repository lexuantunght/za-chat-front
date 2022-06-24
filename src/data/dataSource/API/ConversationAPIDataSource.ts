import { PagingData } from '../../../common/types/PagingData';
import appConfig from '../../../utils/app/appConfig';
import Network from '../../networking/Network';
import ConversationDataSource from '../ConversationDataSource';
import { ConversationAPIEntity } from './entity/ConversationAPIEntity';

export default class ConversationAPIDataSourceImpl implements ConversationDataSource {
    async getConversations() {
        const response = await Network.getInstance().getHelper<PagingData<ConversationAPIEntity>>(
            `${appConfig.baseUrl}/chat/conversations`
        );
        return response.data || {};
    }
}
