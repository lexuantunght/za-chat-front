import React from 'react';

const DEFAULT_ZOOM_STEP = 0.3;
const DEFAULT_LARGE_ZOOM = 4;

function getXY(
    e: React.TouchEvent<HTMLImageElement> & React.MouseEvent<HTMLImageElement, MouseEvent>
) {
    let x = 0;
    let y = 0;
    if (e.touches && e.touches.length) {
        x = e.touches[0].pageX;
        y = e.touches[0].pageY;
    } else {
        x = e.pageX;
        y = e.pageY;
    }
    return { x, y };
}
function getXYByMouseEvent(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    return { x: e.pageX, y: e.pageY };
}
function Cond(props: { condition?: boolean; children: React.ReactNode }) {
    if (!props.condition) return null;
    return <React.Fragment>{props.children}</React.Fragment>;
}

type ImageViewerProps = {
    children?: React.ReactNode;
    startIndex?: number;
    images?: Array<{ url: string; title?: string }>;
    image?: string;
    zoomStep?: number;
    allowZoom?: boolean;
    doubleClickZoom?: number;
    onNavigateImage?: CallableFunction;
    allowRotate?: boolean;
    buttonAlign?: string;
    showTitle?: boolean;
    allowReset?: boolean;
    keyboardInteraction?: boolean;
    clickOutsideToExit?: boolean;
    title?: string;
};

type ImageViewerState = {
    multi: boolean;
    moving: boolean;
    loading: boolean;
    x: number;
    y: number;
    zoom: number;
    rotate: number;
    current: number;
};

export default class ImageViewer extends React.Component<ImageViewerProps, ImageViewerState> {
    initX = 0;
    initY = 0;
    lastX = 0;
    lastY = 0;
    _cont = React.createRef<HTMLDivElement>();
    state: ImageViewerState = {
        x: 0,
        y: 0,
        zoom: 1,
        rotate: 0,
        loading: true,
        moving: false,
        current: this.props?.startIndex ?? 0,
        multi: this.props?.images?.length ? true : false,
    };
    createTransform = (x: number, y: number, zoom: number, rotate: number) =>
        `translate3d(${x}px,${y}px,0px) scale(${zoom}) rotate(${rotate}deg)`;
    stopSideEffect = (e: React.MouseEvent | KeyboardEvent) => e.stopPropagation();
    getCurrentImage = (s: ImageViewerState, p: ImageViewerProps) => {
        if (!s.multi) return p.image ?? '';
        return p.images?.[s.current]?.url ?? '';
    };
    getCurrentTitle = (s: ImageViewerState, p: ImageViewerProps) => {
        if (!s.multi) return p.title ?? '';
        return p.images?.[s.current]?.title ?? '';
    };
    resetZoom = () => this.setState({ x: 0, y: 0, zoom: 1 });
    shockZoom = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const {
            zoomStep = DEFAULT_ZOOM_STEP,
            allowZoom = true,
            doubleClickZoom = DEFAULT_LARGE_ZOOM,
        } = this.props;
        if (!allowZoom || !doubleClickZoom) return false;
        this.stopSideEffect(e);
        if (this.state.zoom > 1) return this.resetZoom();
        const _z = (zoomStep < 1 ? Math.ceil(doubleClickZoom / zoomStep) : zoomStep) * zoomStep;
        const _xy = getXYByMouseEvent(e);
        const _cbr = this._cont.current?.getBoundingClientRect?.() || {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        const _ccx = _cbr.y + _cbr.width / 2;
        const _ccy = _cbr.y + _cbr.height / 2;
        const x = (_xy.x - _ccx) * -1 * _z;
        const y = (_xy.y - _ccy) * -1 * _z;
        this.setState({ x, y, zoom: _z });
    };
    navigateImage = (direction: string, e: KeyboardEvent | React.MouseEvent) => {
        this.stopSideEffect(e);
        let current = 0;
        const { images = [] } = this.props;
        switch (direction) {
            case 'next':
                current = this.state.current + 1;
                break;
            case 'prev':
                current = this.state.current - 1;
                break;
        }
        if (current >= images?.length) current = 0;
        else if (current < 0) current = images.length - 1;
        this.setState({ current, x: 0, y: 0, zoom: 1, rotate: 0, loading: true });
        if (typeof this.props.onNavigateImage === 'function') {
            this.props.onNavigateImage(current);
        }
    };
    startMove = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent> & React.TouchEvent<HTMLImageElement>
    ) => {
        if (this.state.zoom <= 1) return false;
        this.setState({ moving: true });
        const xy = getXY(e);
        this.initX = xy.x - this.lastX;
        this.initY = xy.y - this.lastY;
    };
    duringMove = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent> & React.TouchEvent<HTMLImageElement>
    ) => {
        if (!this.state.moving) return false;
        const xy = getXY(e);
        this.lastX = xy.x - this.initX;
        this.lastY = xy.y - this.initY;
        this.setState({
            x: xy.x - this.initX,
            y: xy.y - this.initY,
        });
    };
    endMove = () => this.setState({ moving: false });
    applyZoom = (type: string) => {
        const { zoomStep = DEFAULT_ZOOM_STEP } = this.props;
        let newZoom = 1;
        switch (type) {
            case 'in':
                this.setState({ zoom: this.state.zoom + zoomStep });
                break;
            case 'out':
                newZoom = this.state.zoom - zoomStep;
                if (newZoom < 1) break;
                else if (newZoom === 1) this.setState({ x: 0, y: 0, zoom: 1 });
                else this.setState({ zoom: newZoom });
                break;
            case 'reset':
                this.resetZoom();
                break;
        }
    };
    applyRotate = (type: string) => {
        switch (type) {
            case 'cw':
                this.setState({ rotate: this.state.rotate + 90 });
                break;
            case 'acw':
                this.setState({ rotate: this.state.rotate - 90 });
                break;
        }
    };
    reset = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.stopSideEffect(e);
        this.setState({ x: 0, y: 0, zoom: 1, rotate: 0 });
    };
    shouldShowReset = () =>
        this.state.x || this.state.y || this.state.zoom !== 1 || this.state.rotate !== 0;
    keyboardNavigation = (e: KeyboardEvent) => {
        const { allowZoom = true } = this.props;
        const { multi, x, y, zoom } = this.state;
        switch (e.key) {
            case 'ArrowLeft':
                if (multi && zoom === 1) this.navigateImage('prev', e);
                else if (zoom > 1) this.setState({ x: x - 20 });
                break;
            case 'ArrowRight':
                if (multi && zoom === 1) this.navigateImage('next', e);
                else if (zoom > 1) this.setState({ x: x + 20 });
                break;
            case 'ArrowUp':
                if (zoom > 1) this.setState({ y: y + 20 });
                break;
            case 'ArrowDown':
                if (zoom > 1) this.setState({ y: y - 20 });
                break;
            case '+':
                if (allowZoom) this.applyZoom('in');
                break;
            case '-':
                if (allowZoom) this.applyZoom('out');
                break;
                break;
        }
    };
    componentDidMount() {
        document.body.classList.add('za-image-viewer-open-lightbox');
        const { keyboardInteraction = true } = this.props;
        if (keyboardInteraction) document.addEventListener('keyup', this.keyboardNavigation);
    }
    componentWillUnmount() {
        document.body.classList.remove('za-image-viewer-open-lightbox');
        const { keyboardInteraction = true } = this.props;
        if (keyboardInteraction) document.removeEventListener('keyup', this.keyboardNavigation);
    }
    render() {
        const image = this.getCurrentImage(this.state, this.props);
        const title = this.getCurrentTitle(this.state, this.props);
        if (!image) {
            console.warn('Not showing lightbox because no image(s) was supplied');
            return null;
        }
        const {
            allowZoom = true,
            allowRotate = true,
            buttonAlign = 'flex-end',
            showTitle = true,
            allowReset = true,
        } = this.props;
        const { x, y, zoom, rotate, multi, loading, moving } = this.state;
        const _reset = allowReset && this.shouldShowReset();
        return (
            <div className="za-image-viewer-container">
                <div className="za-image-viewer-header" style={{ justifyContent: buttonAlign }}>
                    <Cond condition={Boolean(showTitle && title)}>
                        <div
                            className="za-image-viewer-title"
                            style={{
                                display: buttonAlign === 'center' ? 'none' : 'flex',
                                order: buttonAlign === 'flex-start' ? '2' : 'unset',
                            }}>
                            <span
                                title={title}
                                style={{
                                    textAlign: buttonAlign === 'flex-start' ? 'right' : 'left',
                                }}>
                                {title}
                            </span>
                        </div>
                    </Cond>
                    <Cond condition={Boolean(buttonAlign === 'center' || _reset)}>
                        <div
                            title="Reset"
                            style={{ order: buttonAlign === 'flex-start' ? '1' : 'unset' }}
                            className={`za-image-viewer-button za-image-viewer-icon-reset za-image-viewer-hide-mobile reload ${
                                _reset ? '' : 'za-image-viewer-disabled'
                            }`}
                            onClick={this.reset}></div>
                    </Cond>
                    <Cond condition={multi}>
                        <div
                            title="Previous"
                            className="za-image-viewer-button za-image-viewer-icon-arrow prev za-image-viewer-hide-mobile"
                            onClick={(e) => this.navigateImage('prev', e)}></div>
                        <div
                            title="Next"
                            className="za-image-viewer-button za-image-viewer-icon-arrow next za-image-viewer-hide-mobile"
                            onClick={(e) => this.navigateImage('next', e)}></div>
                    </Cond>
                    <Cond condition={allowZoom}>
                        <div
                            title="Zoom In"
                            className="za-image-viewer-button za-image-viewer-icon-zoomin zoomin"
                            onClick={() => this.applyZoom('in')}></div>
                        <div
                            title="Zoom Out"
                            className={`za-image-viewer-button za-image-viewer-icon-zoomout zoomout ${
                                zoom <= 1 ? 'za-image-viewer-disabled' : ''
                            }`}
                            onClick={() => this.applyZoom('out')}></div>
                    </Cond>
                    <Cond condition={allowRotate}>
                        <div
                            title="Rotate left"
                            className="za-image-viewer-button za-image-viewer-icon-rotate rotatel"
                            onClick={() => this.applyRotate('acw')}></div>
                        <div
                            title="Rotate right"
                            className="za-image-viewer-button za-image-viewer-icon-rotate rotater"
                            onClick={() => this.applyRotate('cw')}></div>
                    </Cond>
                </div>
                <div
                    className={`za-image-viewer-canvas${loading ? ' za-image-viewer-loading' : ''}`}
                    ref={this._cont}>
                    <img
                        draggable="false"
                        style={{
                            transform: this.createTransform(x, y, zoom, rotate),
                            cursor: zoom > 1 ? 'grab' : 'unset',
                            transition: moving ? 'none' : 'all 0.1s',
                        }}
                        onMouseDown={this.startMove}
                        onTouchStart={this.startMove}
                        onMouseMove={this.duringMove}
                        onTouchMove={this.duringMove}
                        onMouseUp={this.endMove}
                        onMouseLeave={this.endMove}
                        onTouchEnd={this.endMove}
                        onClick={(e) => this.stopSideEffect(e)}
                        onDoubleClick={(e) => this.shockZoom(e)}
                        onLoad={() => this.setState({ loading: false })}
                        className={`za-image-viewer-img${
                            loading ? ' za-image-viewer-loading' : ''
                        }`}
                        title={title}
                        src={image}
                        alt={title}
                    />
                    <div className="mobile-controls za-image-viewer-show-mobile">
                        {multi ? (
                            <div
                                title="Previous"
                                className="za-image-viewer-button za-image-viewer-icon-arrow prev"
                                onClick={(e) => this.navigateImage('prev', e)}></div>
                        ) : null}
                        {_reset ? (
                            <div
                                title="Reset"
                                className="za-image-viewer-button za-image-viewer-icon-reset reload"
                                onClick={this.reset}></div>
                        ) : null}
                        {multi ? (
                            <div
                                title="Next"
                                className="za-image-viewer-button za-image-viewer-icon-arrow next"
                                onClick={(e) => this.navigateImage('next', e)}></div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}
