import React from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

interface VirtualizedListProps<T> {
    data: T[];
    rowRenderer: (item: T, index: number, measure: () => void) => React.ReactNode;
}

function VirtualizedList<T>({ data, rowRenderer }: VirtualizedListProps<T>) {
    const listRef = React.useRef<List>(null);
    const cache = new CellMeasurerCache({
        defaultWidth: 100,
        minWidth: 75,
        fixedHeight: false,
        fixedWidth: true,
    });

    return (
        <AutoSizer>
            {({ height, width }) => (
                <List
                    height={height}
                    ref={listRef}
                    width={width}
                    rowCount={data.length}
                    rowHeight={cache.rowHeight}
                    overscanRowCount={10}
                    rowRenderer={({ key, index, style, parent }) => (
                        <CellMeasurer cache={cache} key={key} parent={parent} rowIndex={index}>
                            {({
                                registerChild,
                                measure,
                            }: {
                                registerChild: React.LegacyRef<HTMLDivElement>;
                                measure: () => void;
                            }) => (
                                <div
                                    ref={registerChild}
                                    style={{
                                        ...style,
                                    }}>
                                    {rowRenderer(data[index], index, measure)}
                                </div>
                            )}
                        </CellMeasurer>
                    )}
                />
            )}
        </AutoSizer>
    );
}

export default VirtualizedList;
