import BaseAdapter from '../adapter/BaseAdapter';
import IndexedDBAdapter from '../adapter/IndexedDBAdapter';
import SearchDBAdapter from '../adapter/SearchDBAdapter';
import { MessageEntity } from '../entity/MessageEntity';

type SearchContext = {
    conversationId: string;
    messageId: string;
    messageType: string;
};

type SearchIndex = {
    contextId: number;
    keywordId: number;
};

class SearchQueries {
    private searchAdapter: SearchDBAdapter;
    private adapter: BaseAdapter;
    private segmenter;
    public constructor() {
        this.searchAdapter = new SearchDBAdapter();
        this.adapter = new IndexedDBAdapter();
        this.segmenter = new Intl.Segmenter(['en', 'vi'], {
            granularity: 'word',
        });
    }

    public async addMessage(message: MessageEntity) {
        return new Promise<void>(() => {
            this.addContext({
                messageId: message._id,
                conversationId: message.toUid,
                messageType: message.type,
            }).then((index) => {
                if (!index) {
                    return;
                }
                const keywords = Array.from(
                    this.segmenter.segment(message.content)[Symbol.iterator]()
                )
                    .filter((kw) => kw.isWordLike)
                    .map((kw) => ({
                        keyword: kw.segment
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .toLowerCase(),
                    }));
                this.addKeywords(keywords).then((keywordIds) => {
                    this.searchAdapter.addMany<SearchIndex, number>(
                        'stidx',
                        keywordIds.map((keywordId) => ({ contextId: index, keywordId }))
                    );
                });
            });
        });
    }

    public addKeyword(keyword: { keyword: string }) {
        return this.searchAdapter.addOne<{ keyword: string }, number>('stkw', keyword, 'keyword');
    }

    public addKeywords(keywords: Array<{ keyword: string }>) {
        return this.searchAdapter.addMany<{ keyword: string }, number>('stkw', keywords, 'keyword');
    }

    public addContext(context: SearchContext) {
        return this.searchAdapter.addOne<SearchContext, number>(
            'stcont',
            context,
            'messageId',
            true
        );
    }

    public addSearchIndex(idx: SearchIndex) {
        return this.searchAdapter.addOne('stidx', idx);
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
        const data = [];
        const sconts = new Map<string, SearchContext>();
        for (const subkey of subkeys) {
            const contexts = await this.searchAdapter.searchMessages(subkey);
            contexts.forEach((context) => {
                if (
                    !sconts.has(context.messageId) &&
                    (!conversationId || context.conversationId === conversationId)
                ) {
                    sconts.set(context.messageId, context);
                }
            });
        }
        for (const scont of Array.from(sconts.values())) {
            data.push(await this.adapter.get<MessageEntity>('messages', scont.messageId));
        }
        return { total: 0, data };
    }
}

export default SearchQueries;
