import React from 'react';
import { Virtuoso } from 'react-virtuoso';

interface VirtualizedListProps<T> {
    data: T[];
    rowRenderer: (item: T, index: number, measure?: () => void) => React.ReactNode;
    reverse?: boolean;
    onLoadMore?: (page: number) => void;
    total?: number;
    initItemCount?: number;
}

function VirtualizedList<T>({
    data,
    reverse,
    rowRenderer,
    onLoadMore,
    total = 0,
    initItemCount = 30,
}: VirtualizedListProps<T>) {
    const [firstItemIndex, setFirstItemIndex] = React.useState(999999999);
    const prependItems = () => {
        if (data.length < total) {
            onLoadMore?.(data.length / initItemCount);
        }
    };

    React.useEffect(() => {
        if (data.length > initItemCount) {
            setFirstItemIndex(firstItemIndex - initItemCount);
        }
    }, [data]);

    React.useEffect(() => {
        if (total > initItemCount) {
            setFirstItemIndex(total - initItemCount);
        }
    }, [total]);

    return (
        <Virtuoso
            style={{ height: '100%', width: '100%' }}
            data={data}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={reverse ? initItemCount - 1 : 0}
            startReached={prependItems}
            itemContent={(index, item) => rowRenderer(item, data.indexOf(item))}
            components={{ Header: () => <br />, Footer: () => <br /> }}
        />
    );
}

export default VirtualizedList;
