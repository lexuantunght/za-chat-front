import { PagingData } from '../../../common/types/PagingData';
import appConfig from '../../../utils/app/appConfig';
import Network from '../../networking/Network';
import ConversationQueries from '../../storage/database/query/ConversationQueries';
import ConversationDataSource from '../ConversationDataSource';
import { ConversationAPIEntity } from './entity/ConversationAPIEntity';

export class ConversationAPIDataSourceImpl implements ConversationDataSource {
    private clientQuery;
    constructor() {
        this.clientQuery = new ConversationQueries();
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

export const conversationDataSource = new ConversationAPIDataSourceImpl();
