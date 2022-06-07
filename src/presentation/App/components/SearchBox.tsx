import React from 'react';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import SearchBar from '../../../common/components/SearchBar';
import noResultLogo from '../../../common/resources/no-result.png';
import { Contact } from '../../../domain/model/Contact';

interface SearchBoxProps {
    onClickResult?: (contact: Contact) => void;
    onClose?: () => void;
    t: CallableFunction;
    contacts?: Contact[];
}

const SearchBox = ({ onClickResult, onClose, t, contacts = [] }: SearchBoxProps) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [keyword, setKeyword] = React.useState('');

    const onCloseSearch = () => {
        setIsFocused(false);
        onClose?.();
    };

    return (
        <div className="app-search-view">
            <SearchBar
                id="app-search-input"
                placeholder={t('search')}
                onFocus={() => setIsFocused(true)}
                onReset={() => setKeyword('')}
                onEndEditing={(value: string) => setKeyword(value)}
            />
            {isFocused ? (
                <Button className="app-search-close" variant="text" onClick={onCloseSearch}>
                    {t('close')}
                </Button>
            ) : (
                <Button
                    variant="text"
                    className="app-search-view-addcontact"
                    title={t('addContact')}>
                    <Icon name="user-plus" />
                </Button>
            )}
            {isFocused && (
                <div className="app-search-result">
                    <div className="app-search-result-title">{t('searchResult')}</div>
                    <div className="app-search-result-list">
                        {contacts.map((contact, index) => (
                            <div
                                className="chat-item"
                                key={index}
                                onClick={() => onClickResult?.(contact)}>
                                <img src={contact.avatar} className="chat-avatar" />
                                <div className="chat-name">{contact.name}</div>
                            </div>
                        ))}
                    </div>
                    {contacts.length === 0 && keyword.length > 0 && (
                        <div className="app-search-no-result">
                            <img src={noResultLogo} />
                            <div>{t('notFoundResult')}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBox;