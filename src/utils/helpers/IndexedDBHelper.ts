const indexedDB = window.indexedDB;
let db: IDBDatabase;

const initialize = () => {
    const openRequest = indexedDB.open('ZaChat', 1.0);
    openRequest.onupgradeneeded = function () {
        // triggers if the client had no database
        // ...perform initialization...
    };

    openRequest.onerror = function () {
        console.error('Error', openRequest.error);
    };

    openRequest.onsuccess = function () {
        db = openRequest.result;
        // continue working with database using db object
    };
};

export const createObject = (objectName: string, keyPath: string) => {
    initialize();
    if (!db) {
        return false;
    }
    db.createObjectStore(objectName, { keyPath });
    db.close();
};

export const getObject = (objectName: string, key: string) => {
    initialize();
    if (!db) {
        return null;
    }
    const transaction = db.transaction(objectName, 'readwrite');
    const obj = transaction.objectStore(objectName).get(key);
    db.close();
    return obj;
};

export const deleteDatabase = (dbName: string) => {
    indexedDB.deleteDatabase(dbName);
};
