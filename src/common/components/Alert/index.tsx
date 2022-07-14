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

const Alert = ({
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
}: AlertProps) => {
    const [alertContent, setAlertContent] = React.useState(content);

    React.useEffect(() => {
        if (content) {
            setAlertContent(content);
        }
    }, [content]);

    return (
        <Modal title={title} isOpen={isShow} onClose={onClose} className={className}>
            <div className="za-alert-content">{alertContent}</div>
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
