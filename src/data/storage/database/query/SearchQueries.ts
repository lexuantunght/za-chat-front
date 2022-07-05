import _uniqBy from 'lodash-es/uniqBy';
import { MessageAPIEntity } from '../../../dataSource/API/entity/MessageAPIEntity';
import main_db from '../db/MainDB';
import search_db from '../db/SearchDB';
import { MessageEntity } from '../entity/MessageEntity';

class SearchQueries {
    private segmenter;
    public constructor() {
        this.segmenter = new Intl.Segmenter(['en', 'vi'], {
            granularity: 'word',
        });
    }

    public async addMessages(messages: MessageEntity[]) {
        for (const message of messages) {
            await this.addMessage(message);
        }
    }

    public async addMessage(message: MessageEntity) {
        if ((await search_db.table('stcont').where('messageId').equals(message._id).count()) > 0) {
            return;
        }
        const contextId = await search_db.table('stcont').add({
            messageId: message._id,
            conversationId: message.toUid,
            messageType: message.type,
        });
        const keywords = Array.from(this.segmenter.segment(message.content)[Symbol.iterator]())
            .filter((kw) => kw.isWordLike)
            .map((kw) => ({
                keyword: kw.segment
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase(),
            }));
        for (const keyword of _uniqBy(keywords, 'keyword')) {
            let keywordId = (
                await search_db.table('stkw').where('keyword').equals(keyword.keyword).primaryKeys()
            )[0];
            if (!keywordId) {
                keywordId = await search_db.table('stkw').add(keyword);
            }
            await search_db.table('stidx').add({ keywordId, contextId });
        }
    }

    public async searchMessages(keyword: string, conversationId?: string) {
        const subkeys = Array.from(this.segmenter.segment(keyword)[Symbol.iterator]())
            .filter((kw) => kw.isWordLike)
            .map((kw) =>
                kw.segment
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
            );
        const keywordIds = await search_db
            .table('stkw')
            .where('keyword')
            .startsWithAnyOf(subkeys)
            .primaryKeys();
        const contextIds = _uniqBy(
            await search_db.table('stidx').where('keywordId').anyOf(keywordIds).toArray(),
            'contextId'
        ).map((idx) => idx.contextId);
        const contexts = (await search_db.table('stcont').bulkGet(contextIds)).filter(
            (cont) => !conversationId || cont.conversationId === conversationId
        );
        const messages: Array<MessageAPIEntity> = await main_db
            .table('messages')
            .bulkGet(contexts.map((context) => context.messageId));
        return { total: messages.length, data: messages };
    }
}

export default SearchQueries;
