import React from 'react';
import Button from '../Button';
import Icon from '../Icon';

type SearchBarProps = {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCancel?: () => void;
    onSearch?: () => void;
    name?: string;
    id?: string;
    value?: string;
    placeholder?: string;
};

const SearchBar = ({
    onCancel,
    onChange,
    onSearch,
    value = '',
    name,
    id,
    placeholder,
}: SearchBarProps) => {
    return (
        <div className="za-searchbar-container">
            <Button variant="text" type="button" onClick={onSearch}>
                <Icon width="20" height="20" name="search" />
            </Button>
            <input
                className="za-searchbar-text"
                type="text"
                value={value}
                name={name}
                id={id}
                onChange={onChange}
                placeholder={placeholder}
            />
            {value !== '' && (
                <Button variant="text" type="button" onClick={onCancel}>
                    <Icon name="cancel" />
                </Button>
            )}
        </div>
    );
};

export default SearchBar;
