import { MessageAPIEntity } from '../../../dataSource/API/entity/MessageAPIEntity';
import main_db from '../db/MainDB';
import { MessageEntity } from '../entity/MessageEntity';

class MessageQueries {
    public async getMessages(conversationId: string, fromSendTime?: number, limit?: number) {
        const total = await main_db.table('messages').where('toUid').equals(conversationId).count();
        const messages = await main_db
            .table('messages')
            .where('[toUid+sendTime]')
            .between([conversationId], [conversationId, fromSendTime])
            .offset(Math.max(total - (limit || 0), 0))
            .toArray();
        return { data: messages as Array<MessageAPIEntity>, total };
    }

    public async navigateMessage(
        conversationId: string,
        fromSendTime: number,
        msgId: string,
        limit?: number
    ) {
        const total = await main_db.table('messages').where('toUid').equals(conversationId).count();
        const totalUpper = await main_db
            .table('messages')
            .where('[toUid+sendTime+_id]')
            .between([conversationId], [conversationId, fromSendTime, msgId])
            .count();
        const messages = await main_db
            .table('messages')
            .where('[toUid+sendTime+_id]')
            .inAnyRange([
                [[conversationId], [conversationId, fromSendTime, msgId]],
                [
                    [conversationId, fromSendTime, msgId],
                    [conversationId, Date.now()],
                ],
            ])
            .offset(Math.max(totalUpper - (limit || 0), 0))
            .toArray();
        return { data: messages as Array<MessageAPIEntity>, total };
    }

    public addMessage(message: MessageEntity) {
        return main_db.table('messages').add(message);
    }

    public addMessages(messages: MessageEntity[]) {
        main_db.table('messages').bulkPut(messages);
    }
}

export default MessageQueries;
