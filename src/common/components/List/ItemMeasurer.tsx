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

    const handleGetSize = () => {
        const size = {
            width: ref.current?.offsetWidth || 0,
            height: ref.current?.offsetHeight || defaultHeight,
        };
        cache.setSize(index, size);
        onReady?.(size);
        parent.current?.recomputeRowHeight();
    };

    React.useEffect(() => {
        handleGetSize();
    }, [id]);

    return (
        <div ref={ref} style={style} onLoad={handleGetSize}>
            {children}
        </div>
    );
};

export default ItemMeasurer;
