import { PagingData } from '../../../common/types/PagingData';
import appConfig from '../../../utils/app/appConfig';
import Network from '../../networking/Network';
import ConversationQueries from '../../storage/database/query/ConversationQueries';
import ConversationDataSource from '../ConversationDataSource';
import { ConversationAPIEntity } from './entity/ConversationAPIEntity';

export default class ConversationAPIDataSourceImpl implements ConversationDataSource {
    private clientQuery;
    constructor(clientQuery: ConversationQueries) {
        this.clientQuery = clientQuery;
    }
    async getConversations() {
        if (Network.getInstance().getIsErrorConnection()) {
            return this.clientQuery.getConversations();
        }
        const response = await Network.getInstance().getHelper<PagingData<ConversationAPIEntity>>(
            `${appConfig.baseUrl}/chat/conversations`
        );
        this.clientQuery.addConversations(response.data.data);
        return response.data || {};
    }
}
