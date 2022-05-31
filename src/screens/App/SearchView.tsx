import React from 'react';
import { useDispatch } from 'react-redux';
import createDispatch from '../../common/actions/createDispatch';
import Button from '../../common/components/Button';
import Icon from '../../common/components/Icon';
import SearchBar from '../../common/components/SearchBar';
import { useProfile } from '../../hooks/authentication';
import { useFindContacts } from '../../hooks/contact';
import { useMultilingual } from '../../hooks/translation';
import { Contact } from '../Contact/models';
import noResultLogo from '../../common/resources/no-result.png';

const SearchView = () => {
    const dispatch = useDispatch();
    const { t } = useMultilingual();
    const [isFocused, setIsFocused] = React.useState(false);
    const [keyword, setKeyword] = React.useState('');
    const { data: contacts = [], isLoading } = useFindContacts({ keyword });
    const userData = useProfile();

    const onClickResult = (contact: Contact) => {
        dispatch(
            createDispatch('chat.selectedChatItem', {
                _id: contact.conversationId || '',
                avatar: contact.avatar,
                name: contact.name,
                users: [userData, contact],
            })
        );
    };

    return (
        <div className="app-search-view">
            <SearchBar
                id="app-search-input"
                placeholder={t('search')}
                onFocus={() => setIsFocused(true)}
                onReset={() => setKeyword('')}
                onEndEditing={(value) => setKeyword(value)}
            />
            {isFocused ? (
                <Button
                    className="app-search-close"
                    variant="text"
                    onClick={() => setIsFocused(false)}>
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
                                onClick={() => onClickResult(contact)}>
                                <img src={contact.avatar} className="chat-avatar" />
                                <div className="chat-name">{contact.name}</div>
                            </div>
                        ))}
                    </div>
                    {!isLoading && contacts.length === 0 && keyword.length > 0 && (
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

export default React.memo(SearchView);
