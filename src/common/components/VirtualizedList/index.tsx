import React from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

interface VirtualizedListProps<T> {
    data: T[];
    rowRenderer: (item: T, index: number) => React.ReactNode;
    reverse?: boolean;
    onLoadMore?: (page: number, isBottom?: boolean) => void;
    initItemCount?: number;
    isEndTop?: boolean;
    isEndBottom?: boolean;
    spaceTop?: number;
    spaceBottom?: number;
    startIndex?: number;
    fromScrolledDistance?: number;
    onScrolledDistanceCb?: (isOver: boolean) => void;
}

export interface VirtualizedListRef extends VirtuosoHandle {
    scrolledDistance: number;
}

const MAX_FIRST_INDEX = 999999999;

function VirtualizedList<T>(
    {
        data,
        reverse,
        rowRenderer,
        onLoadMore,
        isEndTop,
        isEndBottom,
        onScrolledDistanceCb,
        initItemCount = 30,
        spaceTop = 10,
        spaceBottom = 10,
        fromScrolledDistance = 100,
    }: VirtualizedListProps<T>,
    ref: React.Ref<VirtualizedListRef>
) {
    const [firstItemIndex, setFirstItemIndex] = React.useState(MAX_FIRST_INDEX);
    const [isPrepend, setIsPrepend] = React.useState(false);
    const [oldDataLength, setOldDataLength] = React.useState(0);
    const startPrependItems = () => {
        if (!isEndTop) {
            setOldDataLength(data.length);
            setIsPrepend(true);
            onLoadMore?.(reverse ? 0 : data.length - 1);
        }
    };

    const endPrependItems = () => {
        if (!isEndBottom) {
            onLoadMore?.(reverse ? data.length - 1 : 0, true);
        }
    };

    const handleScroll = (e: React.UIEvent<'div', UIEvent>) => {
        const target = e.target as HTMLDivElement;
        if (onScrolledDistanceCb) {
            if (
                target.scrollTop + target.clientHeight + fromScrolledDistance >=
                target.scrollHeight
            ) {
                onScrolledDistanceCb(false);
                return;
            }
            if (
                target.scrollHeight >=
                fromScrolledDistance + target.scrollTop + target.clientHeight
            ) {
                onScrolledDistanceCb(true);
            }
        }
    };

    React.useEffect(() => {
        if (data.length !== oldDataLength && isPrepend) {
            setFirstItemIndex(Math.max(firstItemIndex - (data.length - oldDataLength), 0));
            setIsPrepend(false);
        }
    }, [data, isPrepend]);

    return (
        <Virtuoso
            ref={ref}
            onScroll={handleScroll}
            style={{ height: '100%', width: '100%' }}
            data={data}
            firstItemIndex={firstItemIndex}
            followOutput="smooth"
            initialTopMostItemIndex={{ index: reverse ? initItemCount - 1 : 0, behavior: 'auto' }}
            startReached={startPrependItems}
            endReached={endPrependItems}
            alignToBottom
            itemContent={(index, item) => rowRenderer(item, data.indexOf(item))}
            components={{
                Header: () => <div style={{ height: spaceTop }} />,
                Footer: () => <div style={{ height: spaceBottom }} />,
            }}
        />
    );
}

export default React.forwardRef(VirtualizedList) as <T>(
    P: VirtualizedListProps<T> & { ref: React.Ref<VirtualizedListRef> }
) => JSX.Element;
