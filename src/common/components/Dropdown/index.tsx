import React from 'react';
import Icon from '../Icon';

type ItemDropdown = {
    value: React.ReactNode;
    label: string;
};

type DropdownProps = {
    options?: ItemDropdown[];
    value?: ItemDropdown;
    onChange?: (item: ItemDropdown) => void;
};

const Dropdown = ({ options = [], onChange, value }: DropdownProps) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, false);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, false);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (contentRef && !contentRef.current?.contains(event.target as Node)) {
            handleClose;
            return;
        }
    };

    return (
        <div className="za-dropdown" ref={contentRef}>
            <button className="za-dropdown-button" onClick={() => setIsOpen(!isOpen)}>
                <div className="za-dropdown-value">{value?.value || options[0].value}</div>
                <Icon name="chevron-down" width={24} height={24} color="#555555" />
            </button>
            <div className={`za-dropdown-content ${isOpen ? 'za-dropdown-content-open' : ''}`}>
                {options.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            onChange?.(item);
                            handleClose();
                        }}>
                        {item.value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;
