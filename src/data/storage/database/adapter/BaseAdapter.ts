import { PagingData } from '../../../../common/types/PagingData';
import { Query } from '../query/Query';

interface BaseAdapter {
    addOne: <T, R>(collectionName: string, data: T, uniqueField?: string) => Promise<R>;
    addMany: <T, R>(collectionName: string, data: Array<T>, uniqueField?: string) => Promise<R[]>;
    getAll: <T>(collectionName: string, query?: Query) => Promise<PagingData<T>>;
    get: <T>(collectionName: string, key: string | number) => Promise<T>;
}

export default BaseAdapter;
