export type Query = {
    indexName: string;
    keyMatch?: string[] | string;
    page?: number;
    limit?: number;
    fromCondition?: Date | string | number;
    orderby?: string;
};
