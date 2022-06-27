import { PagingData } from '../../../../common/types/PagingData';
import { Query } from '../query/Query';

interface BaseAdapter {
    addOne: <T>(collectionName: string, data: T) => Promise<void>;
    addMany: <T>(collectionName: string, data: T[]) => Promise<void>;
    getAll: <T>(collectionName: string, query?: Query) => Promise<PagingData<T>>;
}

export default BaseAdapter;
