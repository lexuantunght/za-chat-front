import React from 'react';
import ReactDOM from 'react-dom';

type ChilrenFuncProps = {
    isOpen: boolean;
    willOpen: boolean;
    willClose: boolean;
};

type DelayedPortalProps = {
    isOpen?: boolean;
    openDelay?: number;
    closeDelay?: number;
    children: ({ isOpen, willOpen, willClose }: ChilrenFuncProps) => React.ReactNode;
};

type DelayedPortalStates = {
    isOpen: boolean;
    willChangeTo: any;
};

class DelayedPortal extends React.Component<DelayedPortalProps, DelayedPortalStates> {
    node: HTMLDivElement;
    didChangeTimeout: NodeJS.Timeout | null;
    constructor(props: DelayedPortalProps) {
        super(props);
        this.node = document.createElement('div');
        this.didChangeTimeout = null;
        this.state = {
            // This lags the `isOpen` prop by the specified delays
            isOpen: false,
            willChangeTo: null
        };
    }

    componentDidMount() {
        document.body.appendChild(this.node);

        if (this.props.isOpen) {
            this.open();
        }
    }

    componentDidUpdate(prevProps: DelayedPortalProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.open();
        } else if (!this.props.isOpen && prevProps.isOpen) {
            this.close();
        }
    }

    open() {
        this.cancelQueue();

        // Force a reflow, so that a transition will be rendered
        // between the initial state, and the state that results
        // from setting `willChangeTo = "open"`.
        this.node && this.node.scrollTop;

        this.setState({
            willChangeTo: 'open'
        });

        this.didChangeTimeout = setTimeout(() => {
            this.setState({
                isOpen: true,
                willChangeTo: null
            });
        }, this.props.openDelay);
    }

    close() {
        this.cancelQueue();

        this.setState({
            willChangeTo: 'closed'
        });

        this.didChangeTimeout = setTimeout(() => {
            this.setState({
                isOpen: false,
                willChangeTo: null
            });
        }, this.props.closeDelay);
    }

    cancelQueue() {
        if (this.didChangeTimeout) {
            clearTimeout(this.didChangeTimeout);
        }
    }

    componentWillUnmount() {
        document.body.removeChild(this.node);
        this.cancelQueue();
    }

    render() {
        // Don't render anything unless there is something to display
        if (!this.props.isOpen && !this.state.isOpen && !this.state.willChangeTo) {
            return null;
        }

        return ReactDOM.createPortal(
            this.props.children({
                isOpen: this.state.isOpen,
                willOpen: this.state.willChangeTo === 'open',
                willClose: this.state.willChangeTo === 'closed'
            }),
            this.node
        );
    }
}

export default DelayedPortal;
