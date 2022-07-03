import { PagingData } from '../../../../common/types/PagingData';
import { Query } from '../query/Query';
import _get from 'lodash-es/get';
import _uniqBy from 'lodash-es/uniqBy';
import { SearchContext } from '../entity/SearchContext';

class SearchDBAdapter {
    protected dbProvider: IDBFactory;
    public constructor() {
        this.dbProvider = window.indexedDB;
        this.initSearchDB();
    }

    private initSearchDB = () => {
        const request = this.open();
        request.onupgradeneeded = function () {
            const db = request.result;
            const keywordStore = db.createObjectStore('stkw', {
                keyPath: 'index',
                autoIncrement: true,
            });
            keywordStore.createIndex('keyword', 'keyword');
            const searchIndexStore = db.createObjectStore('stidx', {
                keyPath: 'index',
                autoIncrement: true,
            });
            searchIndexStore.createIndex('keywordId', 'keywordId', { unique: false });
            const searchContextStore = db.createObjectStore('stcont', {
                keyPath: 'index',
                autoIncrement: true,
            });
            searchContextStore.createIndex('messageId', 'messageId');
        };
        request.onsuccess = function () {
            request.result.close();
        };
    };

    open = () => {
        const request = this.dbProvider.open('za_sidx');
        request.onerror = function (event) {
            console.error('An error occurred with IndexedDB');
            console.error(event);
        };
        return request;
    };

    public addOne = <T, R>(
        collectionName: string,
        data: T,
        uniqueField?: string,
        rejectOnUnique?: boolean
    ) => {
        return new Promise<R | undefined>((resolve) => {
            const request = this.open();
            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction(collectionName, 'readwrite');
                const store = transaction.objectStore(collectionName);
                if (uniqueField) {
                    store.index(uniqueField).getKey(_get(data, uniqueField)).onsuccess = (e) => {
                        const result = (e.target as IDBRequest<R>).result;
                        if (result) {
                            resolve(rejectOnUnique ? undefined : result);
                        } else {
                            store.put(data).onsuccess = (e) => {
                                const result = (e.target as IDBRequest<R>).result;
                                resolve(result);
                            };
                        }
                    };
                } else {
                    store.put(data).onsuccess = (e) => {
                        const result = (e.target as IDBRequest<R>).result;
                        resolve(result);
                    };
                }

                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    };

    public addMany = <T, R>(collectionName: string, data: Array<T>, uniqueField?: string) => {
        return new Promise<R[]>((resolve) => {
            const result: R[] = [];
            const request = this.open();
            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction(collectionName, 'readwrite');
                const store = transaction.objectStore(collectionName);
                if (uniqueField) {
                    _uniqBy(data, uniqueField).forEach((elem) => {
                        store.index(uniqueField).getKey(_get(elem, uniqueField)).onsuccess = (
                            e
                        ) => {
                            const _result = (e.target as IDBRequest<R>).result;
                            if (_result) {
                                result.push(_result);
                            } else {
                                store.put(elem).onsuccess = (e) => {
                                    result.push((e.target as IDBRequest<R>).result);
                                };
                            }
                        };
                    });
                } else {
                    data?.forEach((elem) => {
                        store.put(elem).onsuccess = (e) => {
                            result.push((e.target as IDBRequest<R>).result);
                        };
                    });
                }
                transaction.oncomplete = function () {
                    resolve(result);
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

    public searchMessages = (keyword: string) => {
        return new Promise<SearchContext[]>((resolve) => {
            const request = this.open();
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['stkw', 'stidx', 'stcont'], 'readwrite');
                const keywordStore = transaction.objectStore('stkw');
                const indexStore = transaction.objectStore('stidx');
                const contextStore = transaction.objectStore('stcont');

                const contexts: SearchContext[] = [];
                keywordStore
                    .index('keyword')
                    .getAll(IDBKeyRange.bound(keyword, keyword + '\uffff')).onsuccess = (e) => {
                    const keywords = (
                        e.target as IDBRequest<Array<{ keyword: string; index: number }>>
                    ).result;
                    keywords.forEach((kw) => {
                        indexStore.index('keywordId').getAll(kw.index).onsuccess = (e) => {
                            const idxs = (
                                e.target as IDBRequest<
                                    Array<{ keywordId: number; contextId: number }>
                                >
                            ).result;
                            idxs.forEach((idx) => {
                                contextStore.get(idx.contextId).onsuccess = (e) => {
                                    contexts.push((e.target as IDBRequest<SearchContext>).result);
                                };
                            });
                        };
                    });
                };

                transaction.oncomplete = function () {
                    resolve(contexts);
                    db.close();
                };
            };
        });
    };
}

export default SearchDBAdapter;
