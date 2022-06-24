import { Message } from '../../../../domain/model/Message';
import { MessageAPIEntity } from '../../../dataSource/API/entity/MessageAPIEntity';
import MessageDataSource from '../../../dataSource/MessageDataSource';
import BaseAdapter from '../adapter/BaseAdapter';
import IndexedDBAdapter from '../adapter/IndexedDBAdapter';

class MessageQueries implements MessageDataSource {
    private adapter: BaseAdapter;
    public constructor() {
        this.adapter = new IndexedDBAdapter();
    }

    public getMessages(
        conversationId: string,
        page?: number | undefined,
        limit?: number | undefined
    ) {
        return this.adapter.getAll<MessageAPIEntity>('messages', {
            indexName: 'conversationId',
            keyMatch: [conversationId],
            orderby: 'order',
            page,
            limit,
        });
    }

    public sendMessage(message: Message) {
        return this.adapter.addOne('messages', message);
    }

    public addMessages(messages: Message[]) {
        return this.adapter.addMany('messages', messages);
    }
}

export default MessageQueries;
