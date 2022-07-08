import { MessageAPIEntity } from '../../../dataSource/API/entity/MessageAPIEntity';
import { IndexedDBAdapter } from '../adapter/IndexedDBAdapter';
import { MessageEntity } from '../entity/MessageEntity';

export class MessageQueries {
    private adapter;
    constructor() {
        this.adapter = new IndexedDBAdapter('za-chat');
    }
    public async getMessages(conversationId: string, fromSendTime = Date.now(), limit?: number) {
        const total = await this.adapter.count('messages', {
            where: 'toUid',
            equals: conversationId,
        });
        const messages = await this.adapter.getAsArray('messages', {
            where: '[toUid+sendTime]',
            between: { lower: [conversationId], upper: [conversationId, fromSendTime] },
            offset: Math.max(total - (limit || 0), 0),
        });
        return { data: messages as Array<MessageAPIEntity>, total };
    }

    public async navigateMessage(
        conversationId: string,
        fromSendTime: number,
        msgId: string,
        limit?: number
    ) {
        const total = await this.adapter.count('messages', {
            where: 'toUid',
            equals: conversationId,
        });
        const totalUpper = await this.adapter.count('messages', {
            where: '[toUid+sendTime+_id]',
            between: { lower: [conversationId], upper: [conversationId, fromSendTime, msgId] },
        });
        const messages = await this.adapter.getAsArray('messages', {
            where: '[toUid+sendTime+_id]',
            inRanges: [
                { lower: [conversationId], upper: [conversationId, fromSendTime, msgId] },
                {
                    lower: [conversationId, fromSendTime, msgId],
                    upper: [conversationId, Date.now()],
                },
            ],
            offset: Math.max(totalUpper - (limit || 0), 0),
        });
        return { data: messages as Array<MessageAPIEntity>, total };
    }

    public putMessage(message: MessageEntity) {
        this.adapter.put('messages', message);
    }

    public putMessages(messages: MessageEntity[]) {
        this.adapter.putMany('messages', messages);
    }
}
