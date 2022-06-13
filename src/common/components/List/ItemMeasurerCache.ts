export type Size = {
    width: number;
    height: number;
};

class ItemMeasurerCache {
    private data;

    constructor() {
        this.data = new Map<number | string, Size>();
    }

    public setSize = (id: number | string, size: Size) => {
        this.data.set(id, size);
    };

    public getSize = (id: number | string) => {
        return this.data.get(id);
    };

    public clear = () => {
        this.data.clear();
    };
}

export default ItemMeasurerCache;
