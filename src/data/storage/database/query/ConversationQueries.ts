import { ConversationAPIEntity } from '../../../dataSource/API/entity/ConversationAPIEntity';
import ConversationDataSource from '../../../dataSource/ConversationDataSource';
import main_db from '../db/MainDB';

class ConversationQueries implements ConversationDataSource {
    public async getConversations() {
        const conversations = await main_db.table('conversations').toArray();
        return { data: conversations as Array<ConversationAPIEntity>, total: conversations.length };
    }

    public addConversations(conversations: ConversationAPIEntity[]) {
        main_db.table('conversations').bulkPut(conversations);
    }
}

export default ConversationQueries;
