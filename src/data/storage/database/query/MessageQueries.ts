import { MessageAPIEntity } from '../../../dataSource/API/entity/MessageAPIEntity';
import BaseAdapter from '../adapter/BaseAdapter';
import IndexedDBAdapter from '../adapter/IndexedDBAdapter';
import { MessageEntity } from '../entity/MessageEntity';

class MessageQueries {
    private adapter: BaseAdapter;
    public constructor() {
        this.adapter = new IndexedDBAdapter();
    }

    public getMessages(conversationId: string, fromSendTime?: Date, limit?: number) {
        return this.adapter.getAll<MessageAPIEntity>('messages', {
            indexName: 'userId',
            keyMatch: conversationId,
            orderby: 'sendTime',
            fromCondition: fromSendTime?.toISOString(),
            limit,
        });
    }

    public addMessage(message: MessageEntity) {
        return this.adapter.addOne('messages', message);
    }

    public addMessages(messages: MessageEntity[]) {
        return this.adapter.addMany('messages', messages);
    }
}

export default MessageQueries;
