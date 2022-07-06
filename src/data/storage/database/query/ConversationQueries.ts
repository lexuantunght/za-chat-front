import { ConversationAPIEntity } from '../../../dataSource/API/entity/ConversationAPIEntity';
import ConversationDataSource from '../../../dataSource/ConversationDataSource';
import { IndexedDBAdapter } from '../adapter/IndexedDBAdapter';

class ConversationQueries implements ConversationDataSource {
    private adapter;
    constructor() {
        this.adapter = new IndexedDBAdapter('za-chat');
    }

    public async getConversations() {
        const conversations = await this.adapter.getAsArray('conversations');
        return { data: conversations as Array<ConversationAPIEntity>, total: conversations.length };
    }

    public addConversations(conversations: ConversationAPIEntity[]) {
        this.adapter.putMany('conversations', conversations);
    }
}

export default ConversationQueries;
