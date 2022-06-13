import React from 'react';
import ItemMeasurerCache, { Size } from './ItemMeasurerCache';
import { ListRef } from './index';

type Props = {
    id?: string;
    index: number;
    defaultHeight?: number;
    parent: React.RefObject<ListRef>;
    cache: ItemMeasurerCache;
    onReady?: (size: Size) => void;
    children: JSX.Element;
    style?: React.CSSProperties;
};

const ItemMeasurer = ({
    children,
    parent,
    cache,
    index,
    style,
    onReady,
    id,
    defaultHeight = 75,
}: Props) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const size = {
            width: ref.current?.clientWidth || 0,
            height: ref.current?.clientHeight || defaultHeight,
        };
        cache.setSize(index, size);
        onReady?.(size);
        parent.current?.recomputeRowHeight();
    }, [id]);

    return (
        <div ref={ref} style={style}>
            {children}
        </div>
    );
};

export default ItemMeasurer;
