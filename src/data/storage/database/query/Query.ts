export type Query = {
    indexName: string;
    keyMatch?: string[];
    page?: number;
    limit?: number;
    orderby?: string;
};
