import React from 'react';
import { Virtuoso } from 'react-virtuoso';

interface VirtualizedListProps<T> {
    data: T[];
    rowRenderer: (item: T, index: number) => React.ReactNode;
    reverse?: boolean;
    onLoadMore?: (page: number) => void;
    total?: number;
    initItemCount?: number;
    spaceTop?: number;
    spaceBottom?: number;
}

const defaultMaxFirst = 999999999;

function VirtualizedList<T>({
    data,
    reverse,
    rowRenderer,
    onLoadMore,
    total = 0,
    initItemCount = 30,
    spaceTop = 10,
    spaceBottom = 10,
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
    }, [data, isPrepend]);

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
            components={{
                Header: () => <div style={{ height: spaceTop }} />,
                Footer: () => <div style={{ height: spaceBottom }} />,
            }}
        />
    );
}

export default VirtualizedList;
