import { PagingData } from '../../../../common/types/PagingData';
import { Query } from '../query/Query';
import BaseAdapter from './BaseAdapter';

class IndexedDBAdapter implements BaseAdapter {
    protected dbProvider: IDBFactory;
    public constructor() {
        this.dbProvider = window.indexedDB;
        this.initMainDB();
    }

    protected open = () => {
        const request = this.dbProvider.open('ZaChat');
        request.onerror = function (event) {
            console.error('An error occurred with IndexedDB');
            console.error(event);
        };
        return request;
    };

    private initMainDB = () => {
        const request = this.open();
        request.onupgradeneeded = function () {
            const db = request.result;
            db.createObjectStore('conversations', { keyPath: '_id' });
            const messageStore = db.createObjectStore('messages', { keyPath: '_id' });
            messageStore.createIndex('userId_sendTime', ['toUid', 'sendTime']);
            messageStore.createIndex('userId_sendTime_msgId', ['toUid', 'sendTime', '_id']);
            messageStore.createIndex('userId', 'toUid');
        };
        request.onsuccess = function () {
            request.result.close();
        };
    };

    public addOne = <T, R>(collectionName: string, data: T) => {
        return new Promise<R>(() => {
            const request = this.open();
            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction(collectionName, 'readwrite');
                const store = transaction.objectStore(collectionName);
                store.put(data);
                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    };

    public addMany = <T, R>(collectionName: string, data: T[]) => {
        return new Promise<R>(() => {
            const request = this.open();
            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction(collectionName, 'readwrite');
                const store = transaction.objectStore(collectionName);
                data?.forEach((elem) => {
                    store.put(elem);
                });
                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    };

    public getAll = <T>(collectionName: string, query?: Query) => {
        return new Promise<PagingData<T>>((resolve) => {
            const request = this.open();
            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction(collectionName, 'readwrite');
                const store = transaction.objectStore(collectionName);
                let queryAll: IDBRequest<T[]>;
                let queryCount: IDBRequest<number>;
                if (query) {
                    queryCount = store.index(query.indexName).count(query.keyMatch);
                    queryCount.onsuccess = function () {
                        if (query.orderby) {
                            const limit = query.limit || 30;
                            const cursorQuery = store
                                .index(`${query.indexName}_${query.orderby}`)
                                .openCursor(
                                    IDBKeyRange.bound(
                                        [query.keyMatch],
                                        [query.keyMatch, query.fromCondition]
                                    ),
                                    'prev'
                                );
                            const result: T[] = [];
                            let limitCount = 0;
                            cursorQuery.onsuccess = function (e) {
                                const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
                                if (cursor && limitCount < limit) {
                                    result.unshift(cursor.value);
                                    limitCount += 1;
                                    cursor.continue();
                                } else {
                                    resolve({ data: result, total: queryCount.result });
                                }
                            };
                        } else {
                            queryAll = store
                                .index(query.indexName)
                                .getAll(IDBKeyRange.only(query.keyMatch), query.limit);
                            queryAll.onsuccess = function () {
                                resolve({ data: queryAll.result, total: queryCount.result });
                            };
                        }
                    };
                } else {
                    queryCount = store.count();
                    queryCount.onsuccess = function () {
                        queryAll = store.getAll();
                        queryAll.onsuccess = function () {
                            resolve({ data: queryAll.result, total: queryCount.result });
                        };
                    };
                    queryAll = store.getAll();
                }
                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    };

    public getRangeContainsItem = <T>(collectionName: string, query: Query) => {
        return new Promise<PagingData<T>>((resolve) => {
            const request = this.open();
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(collectionName, 'readwrite');
                const store = transaction.objectStore(collectionName);
                store.index(query.indexName).count(query.keyMatch).onsuccess = (e) => {
                    const total = (e.target as IDBRequest<number>).result;
                    const limit = query.limit || 30;
                    let limitCount = 0;
                    const data: T[] = [];
                    store
                        .index(`${query.indexName}_${query.orderby}_${query.primaryKeyName}`)
                        .openCursor(
                            IDBKeyRange.bound(
                                [query.keyMatch],
                                [query.keyMatch, query.fromCondition, query.primaryKey]
                            ),
                            'prev'
                        ).onsuccess = (e) => {
                        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
                        if (cursor && limitCount < limit) {
                            data.unshift(cursor.value);
                            limitCount += 1;
                            cursor.continue();
                        } else {
                            limitCount = 0;
                            store
                                .index(
                                    `${query.indexName}_${query.orderby}_${query.primaryKeyName}`
                                )
                                .openCursor(
                                    IDBKeyRange.bound(
                                        [query.keyMatch, query.fromCondition, query.primaryKey],
                                        [query.keyMatch, query.toCondition]
                                    ),
                                    'next'
                                ).onsuccess = (e) => {
                                const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
                                if (cursor) {
                                    if (limitCount > 0) data.push(cursor.value);
                                    limitCount += 1;
                                    cursor.continue();
                                } else {
                                    resolve({ data, total });
                                }
                            };
                        }
                    };
                };
                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    };

    public get = <T>(collectionName: string, key: string | number) => {
        return new Promise<T>((resolve) => {
            const request = this.open();
            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction(collectionName, 'readwrite');
                const store = transaction.objectStore(collectionName);
                store.get(key).onsuccess = (e) => {
                    resolve((e.target as IDBRequest<T>).result);
                };

                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    };
}

export default IndexedDBAdapter;
