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

const defaultMaxFirst = 999999999;

function VirtualizedList<T>({
    data,
    reverse,
    rowRenderer,
    onLoadMore,
    total = 0,
    initItemCount = 30,
}: VirtualizedListProps<T>) {
    const [firstItemIndex, setFirstItemIndex] = React.useState(defaultMaxFirst);
    const [isPrepend, setIsPrepend] = React.useState(false);
    const prependItems = () => {
        if (data.length < total) {
            setIsPrepend(true);
            onLoadMore?.(reverse ? 0 : data.length - 1);
        }
    };

    React.useEffect(() => {
        if (data.length > initItemCount && isPrepend) {
            setIsPrepend(false);
            setFirstItemIndex(Math.max(firstItemIndex - initItemCount, 0));
        }
    }, [data]);

    React.useEffect(() => {
        if (total > initItemCount && firstItemIndex === defaultMaxFirst) {
            setFirstItemIndex(total - initItemCount);
        }
    }, [total]);

    return (
        <Virtuoso
            style={{ height: '100%', width: '100%' }}
            data={data}
            firstItemIndex={firstItemIndex}
            followOutput="smooth"
            initialTopMostItemIndex={reverse ? initItemCount - 1 : 0}
            startReached={prependItems}
            itemContent={(index, item) => rowRenderer(item, data.indexOf(item))}
            components={{ Header: () => <br />, Footer: () => <br /> }}
        />
    );
}

export default VirtualizedList;