import React from 'react';
import ReactDOM from 'react-dom';

type PopupMenuProps = {
    children?: React.ReactNode;
};

type PopupMenuStates = {
    activeMenu: boolean;
    top: number;
    left: number;
};

class PopupMenu extends React.Component<PopupMenuProps, PopupMenuStates> {
    node: HTMLDivElement;
    childrenRef: React.RefObject<HTMLDivElement>;

    constructor(props: PopupMenuProps) {
        super(props);
        this.node = document.createElement('div');
        this.childrenRef = React.createRef();
        this.state = {
            activeMenu: false,
            top: 0,
            left: 0,
        };
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        document.body.appendChild(this.node);
        document.addEventListener('mousedown', this.handleClickOutside, false);
        window.addEventListener('resize', this.handleClose, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false);
        window.removeEventListener('resize', this.handleClose, false);
        document.removeChild(this.node);
    }

    handleClose() {
        if (this.state.activeMenu) {
            this.setState({ activeMenu: false });
        }
    }

    handleClickOutside(event: MouseEvent) {
        if (this.childrenRef && !this.childrenRef.current?.contains(event.target as Node)) {
            this.handleClose();
            return;
        }
    }

    toggle(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        if (this.state.activeMenu) {
            this.setState({ activeMenu: false });
            return;
        }
        let top = this.state.top;
        let left = this.state.left;
        const childrenHeight = this.childrenRef.current?.offsetHeight || 0;
        const childrenWidth = this.childrenRef.current?.offsetWidth || 0;
        if (e.currentTarget.offsetLeft + 10 + childrenWidth > window.innerWidth) {
            left = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth - 10;
        } else {
            left = e.currentTarget.offsetLeft + 10;
        }
        if (
            e.currentTarget.offsetTop + e.currentTarget.offsetHeight + childrenHeight >
            window.innerHeight
        ) {
            top = e.currentTarget.offsetTop - childrenHeight;
        } else {
            top = e.currentTarget.offsetTop + e.currentTarget.offsetHeight;
        }
        this.setState({
            activeMenu: true,
            top,
            left,
        });
    }

    render() {
        return ReactDOM.createPortal(
            <div
                className="za-popup"
                ref={this.childrenRef}
                onClick={() => this.handleClose()}
                style={{
                    top: this.state.top,
                    left: this.state.left,
                    visibility: this.state.activeMenu ? 'visible' : 'hidden',
                }}>
                {this.props.children}
            </div>,
            this.node
        );
    }
}

export default PopupMenu;
