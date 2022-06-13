import React from 'react';
import useElementSize from './hooks/useElementSize';

export interface ListProps {
    rowHeight: number | ((index: number) => number);
    children: Array<JSX.Element>;
    isVirtualizationEnabled?: boolean;
    paddingStart?: number;
    scrollDirection?: 'default' | 'reverse';
    bufferedItems?: number;
}

export interface ListRef {
    recomputeRowHeight: () => void;
}

const getRowHeight = (rowHeight: number | ((index: number) => number), index: number) => {
    if (typeof rowHeight === 'number') {
        return rowHeight;
    }
    return rowHeight(index);
};

const getStartIndex = (
    childrenLength: number,
    scrollPosition: number,
    rowHeight: number | ((index: number) => number),
    bufferedItems: number
) => {
    let result = 0;
    let totalHeight = 0;
    for (let i = 0; i < childrenLength; i++) {
        totalHeight += getRowHeight(rowHeight, i);
        result += 1;
        if (totalHeight >= scrollPosition) {
            break;
        }
    }
    return Math.max(result - bufferedItems, 0);
};

const getEndIndex = (
    childrenLength: number,
    scrollPosition: number,
    rowHeight: number | ((index: number) => number),
    containerHeight: number,
    bufferedItems: number
) => {
    let result = 0;
    let totalHeight = 0;
    for (let i = 0; i < childrenLength; i++) {
        totalHeight += getRowHeight(rowHeight, i);
        result += 1;
        if (totalHeight >= scrollPosition + containerHeight) {
            break;
        }
    }
    return Math.min(result + bufferedItems, childrenLength - 1);
};

const getElementTop = (
    index: number,
    childrenLength: number,
    rowHeight: number | ((index: number) => number)
) => {
    let top = 0;
    for (let i = 0; i < childrenLength; i++) {
        if (i < index) {
            top += getRowHeight(rowHeight, i);
        }
    }
    return top;
};

const List = (
    {
        rowHeight = 75,
        children,
        isVirtualizationEnabled = true,
        paddingStart = 0,
        scrollDirection = 'default',
        bufferedItems = 10,
    }: ListProps,
    ref: React.ForwardedRef<ListRef>
) => {
    const [containerRef, { height: containerHeight }] = useElementSize<HTMLDivElement>();
    const [scrollPosition, setScrollPosition] = React.useState(0);
    const [recomputed, setRecomputed] = React.useState(1);

    React.useImperativeHandle(ref, () => ({
        recomputeRowHeight: () => {
            setRecomputed(recomputed * -1);
        },
    }));

    // get the children to be rendered
    const visibleChildren = React.useMemo(() => {
        if (!isVirtualizationEnabled) {
            return children.map((child, index) => {
                const childHeight = getRowHeight(rowHeight, index);
                return React.cloneElement(child, {
                    style: {
                        position: 'absolute',
                        top: index * childHeight + paddingStart,
                        height: childHeight,
                        left: 0,
                        right: 0,
                        lineHeight: `${childHeight}px`,
                    },
                });
            });
        }

        const startIndex = getStartIndex(children.length, scrollPosition, rowHeight, bufferedItems);
        const endIndex = getEndIndex(
            children.length,
            scrollPosition,
            rowHeight,
            containerHeight,
            bufferedItems
        );

        return children.slice(startIndex, endIndex + 1).map((child, index) => {
            const pos: number =
                getElementTop(index + startIndex, children.length, rowHeight) + paddingStart;
            return React.cloneElement(child, {
                style: {
                    position: 'absolute',
                    bottom: scrollDirection === 'reverse' ? pos : undefined,
                    top: scrollDirection === 'default' ? pos : undefined,
                    left: 0,
                    right: 0,
                },
            });
        });
    }, [children, containerHeight, recomputed, scrollPosition, isVirtualizationEnabled]);

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = e.target as HTMLElement;
        const scrollPos = Math.abs(target.scrollTop);
        if (
            target.scrollHeight - Math.round(scrollPos) <= target.clientHeight ||
            scrollPos < scrollPosition - 75 * bufferedItems
        ) {
            setScrollPosition(scrollPos);
        }
    };

    return (
        <div
            onScroll={onScroll}
            style={{
                overflowY: 'scroll',
                position: 'relative',
                display: 'flex',
                flexDirection: scrollDirection === 'default' ? 'column' : 'column-reverse',
            }}
            ref={containerRef}
            className="za-list">
            {visibleChildren}
        </div>
    );
};

export default React.forwardRef(List);
