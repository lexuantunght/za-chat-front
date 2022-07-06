import { DBManager } from '../db/DBManager';

type Range = {
    lower?: string | (string | number)[] | number;
    upper?: string | (string | number)[] | number;
    includeLower?: boolean;
    includeUpper?: boolean;
};

export type Query = {
    where?: string | string[];
    limit?: number;
    equals?: string | string[] | number | number[];
    between?: Range;
    offset?: number;
    inRanges?: Array<Range>;
};

export class IndexedDBAdapter {
    private db;
    constructor(dbName: string) {
        this.db = DBManager.getInstance().getDB(dbName);
    }

    public async getAsArray(tableName: string, query?: Query) {
        if (!query) {
            return this.db.table(tableName).toArray();
        }
        const { where, equals, between, inRanges: inRange, offset = 0 } = query;
        const table = this.db.table(tableName);
        if (where && equals) {
            return table.where(where).equals(equals).offset(offset).toArray();
        }
        if (where && between) {
            return table
                .where(where)
                .between(between.lower, between.upper, between.includeLower, between.includeUpper)
                .offset(offset)
                .toArray();
        }
        if (where && inRange) {
            return table
                .where(where)
                .inAnyRange(inRange.map((range) => [range.upper, range.lower]))
                .offset(offset)
                .toArray();
        }
        return this.db.table(tableName).offset(offset).toArray();
    }

    public async putMany<T>(tableName: string, items: T[]) {
        return this.db.table(tableName).bulkPut(items);
    }

    public async put<T>(tableName: string, item: T) {
        return this.db.table(tableName).put(item);
    }

    public async count(tableName: string, { where, equals, between }: Query) {
        const table = this.db.table(tableName);
        if (where && equals) {
            return table.where(where).equals(equals).count();
        }
        if (where && between) {
            return table
                .where(where)
                .between(between.lower, between.upper, between.includeLower, between.includeUpper)
                .count();
        }
        return table.count();
    }

    public async add<T>(tableName: string, item: T) {
        return this.db.table(tableName).add(item);
    }

    public async addMany<T>(tableName: string, items: T[]) {
        return this.db.table(tableName).bulkAdd(items);
    }
}
