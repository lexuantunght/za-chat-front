import React from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

interface VirtualizedListProps<T> {
    data: T[];
    rowRenderer: (item: T, index: number) => React.ReactNode;
}

function VirtualizedList<T>({ data, rowRenderer }: VirtualizedListProps<T>) {
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
                    width={width}
                    rowCount={data.length}
                    rowHeight={cache.rowHeight}
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
                                    }}
                                    onLoad={measure}>
                                    {rowRenderer(data[index], index)}
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
