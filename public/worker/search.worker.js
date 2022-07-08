importScripts('https://unpkg.com/dexie@3.2.2/dist/dexie.js');

const segmenter = new Intl.Segmenter(['en', 'vi'], {
    granularity: 'word',
});

const search_db = new Dexie('za-search');
search_db.version(1).stores({
    stkw: '++index, &keyword',
    stidx: '++index, keywordId',
    stcont: '++index, &messageId',
});

const main_db = new Dexie('za-chat');
main_db.version(1).stores({
    conversations: '_id',
    messages: '_id, [toUid+sendTime], [toUid+sendTime+_id], toUid',
});

onmessage = async (e) => {
    if (e.data.type === 'search') {
        const { keyword, conversationId } = e.data;
        const subkeys = Array.from(segmenter.segment(keyword)[Symbol.iterator]())
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

        let contextIds = Array.from(
            (await search_db.table('stidx').where('keywordId').anyOf(keywordIds).toArray()).map(
                (idx) => idx.contextId
            )
        );

        const mappedContexts = new Map();
        contextIds.forEach((contextId) => {
            const times = mappedContexts.get(contextId);
            mappedContexts.set(contextId, times ? times + 1 : 1);
        });
        if (subkeys.length > 1) {
            contextIds = Array.from(mappedContexts.keys()).filter(
                (id) => mappedContexts.get(id) > 1
            );
        } else {
            contextIds = Array.from(mappedContexts.keys());
        }
        const contexts = (await search_db.table('stcont').bulkGet(contextIds)).filter(
            (cont) => !conversationId || cont.conversationId === conversationId
        );

        const messages = await main_db
            .table('messages')
            .bulkGet(contexts.map((context) => context.messageId));

        postMessage({ messages, total: messages.length, subkeys });
    }
    if (e.data.type === 'input') {
        const { messages } = e.data;
        for (const message of messages) {
            if (
                (await search_db.table('stcont').where('messageId').equals(message._id).count()) > 0
            ) {
                continue;
            }

            const contextId = await search_db.table('stcont').add({
                messageId: message._id,
                conversationId: message.toUid,
                messageType: message.type,
            });

            const contentSplitted = Array.from(
                segmenter.segment(message.content)[Symbol.iterator]()
            )
                .filter((kw) => kw.isWordLike)
                .map((kw) =>
                    kw.segment
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase()
                );

            let fileContentSplitted = [];
            if (message.files) {
                const imageFiles = message.files
                    .filter((file) => file.type?.startsWith('image/') && file.textContent)
                    .map((file) => file.textContent);
                imageFiles.forEach((text) => {
                    fileContentSplitted.push(
                        Array.from(segmenter.segment(text)[Symbol.iterator]())
                            .filter((kw) => kw.isWordLike)
                            .map((kw) =>
                                kw.segment
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')
                                    .toLowerCase()
                            )
                    );
                });
            }

            const keywords = new Set(...contentSplitted, ...fileContentSplitted);

            for (const keyword of keywords) {
                let keywordId = (
                    await search_db.table('stkw').where('keyword').equals(keyword).primaryKeys()
                )[0];
                if (!keywordId) {
                    keywordId = await search_db.table('stkw').add({ keyword });
                }
                await search_db.table('stidx').add({ keywordId, contextId });
            }
        }
    }
};
