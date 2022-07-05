import Dexie from 'dexie';

const search_db = new Dexie('za-search');

search_db.version(1).stores({
    stkw: '++index, &keyword',
    stidx: '++index, keywordId',
    stcont: '++index, &messageId',
});

export default search_db;
