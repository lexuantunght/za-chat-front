import React from 'react';
import Button from '../Button';
import Modal from '../Modal';

type AlertProps = {
    title?: string;
    content?: React.ReactNode;
    onCancel?: () => void;
    onClose?: () => void;
    cancelText?: string;
    acceptText?: string;
    onAccept?: () => void;
    isShow?: boolean;
    className?: string;
    severity?: 'error' | 'success';
};

const Alert: React.FC<AlertProps> = ({
    title,
    isShow,
    onCancel,
    onAccept,
    onClose,
    content,
    cancelText = 'Hủy',
    acceptText = 'Đồng ý',
    className,
    severity,
}) => {
    return (
        <Modal title={title} isOpen={isShow} onClose={onClose} className={className}>
            <div>{content}</div>
            <div className="za-alert-footer">
                {onCancel && (
                    <Button variant="outlined" onClick={onCancel}>
                        {cancelText}
                    </Button>
                )}
                <Button
                    className={`za-alert-accept ${severity ? `za-button-${severity}` : ''}`}
                    onClick={onAccept}>
                    {acceptText}
                </Button>
            </div>
        </Modal>
    );
};

export default Alert;
