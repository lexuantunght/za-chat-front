import React from 'react';
import Button from '../Button';
import Icon from '../Icon';
import DelayedPortal from './DelayedPortal';

type ModalProps = {
    isOpen?: boolean;
    onClose?: () => void;
    title?: string;
    children?: React.ReactNode;
    className?: string;
};

const Modal = (props: ModalProps) => {
    return (
        <DelayedPortal isOpen={props.isOpen} openDelay={500}>
            {({ isOpen, willOpen, willClose }) => (
                <div
                    className={`za-modal ${isOpen ? 'za-modal-open' : 'za-modal-closed'} ${
                        willOpen ? 'za-modal-will-open' : ''
                    } ${willClose ? 'za-modal-will-closed' : ''}`}>
                    <div className={`za-modal-content ${props.className ? props.className : ''}`}>
                        <div className="za-modal-header">
                            <span className="za-modal-title">{props.title}</span>
                            <Button variant="text" onClick={props.onClose}>
                                <Icon name="cancel" />
                            </Button>
                        </div>
                        <div className="za-modal-body">{props.children}</div>
                    </div>
                </div>
            )}
        </DelayedPortal>
    );
};

export default Modal;
