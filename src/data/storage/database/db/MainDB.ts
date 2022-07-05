import Dexie from 'dexie';

const main_db = new Dexie('za-chat');
main_db.version(1).stores({
    conversations: '_id',
    messages: '_id, [toUid+sendTime], [toUid+sendTime+_id], toUid',
});

export default main_db;
