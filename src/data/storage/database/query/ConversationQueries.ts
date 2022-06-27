import { ConversationAPIEntity } from '../../../dataSource/API/entity/ConversationAPIEntity';
import ConversationDataSource from '../../../dataSource/ConversationDataSource';
import BaseAdapter from '../adapter/BaseAdapter';
import IndexedDBAdapter from '../adapter/IndexedDBAdapter';

class ConversationQueries implements ConversationDataSource {
    private adapter: BaseAdapter;
    public constructor() {
        this.adapter = new IndexedDBAdapter();
    }

    public getConversations() {
        return this.adapter.getAll<ConversationAPIEntity>('conversations');
    }

    public addConversations(conversations: ConversationAPIEntity[]) {
        return this.adapter.addMany('conversations', conversations);
    }
}

export default ConversationQueries;
