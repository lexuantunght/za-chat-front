import appConfig from '../../../utils/app/appConfig';
import Network from '../../../utils/networking/Network';
import ConversationDataSource from '../ConversationDataSource';
import { ConversationAPIEntity } from './entity/ConversationAPIEntity';

export default class ConversationAPIDataSourceImpl implements ConversationDataSource {
    async getConversations() {
        const response = await Network.getInstance().getHelper<ConversationAPIEntity[]>(
            `${appConfig.baseUrl}/conversations`
        );
        return response.data || [];
    }
}
