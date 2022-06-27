import React from 'react';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import Modal from '../../../common/components/Modal';
import SearchBar from '../../../common/components/SearchBar';
import noResultLogo from '../../../common/resources/no-result.png';
import AppController from '../../../controller/AppController';
import ContactController from '../../../controller/contact/ContactController';
import useController from '../../../controller/hooks';
import { UserData } from '../../../domain/model/UserData';

interface SearchBoxProps {
    onClickResult?: (user: UserData) => void;
    onClose?: () => void;
    t: CallableFunction;
}

const SearchBox = ({ onClickResult, onClose, t }: SearchBoxProps) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isOpenAddFriend, setIsOpenAddFriend] = React.useState(false);
    const [keyword, setKeyword] = React.useState('');
    const { findUsers, cancelRequest, requestFriend, updateSearchUser } =
        useController(ContactController);
    const { useGetState, clearSearchResult } = useController(AppController);
    const searchResult = useGetState((state) => state.app.searchResult);

    const onCloseSearch = () => {
        setIsFocused(false);
        onClose?.();
    };

    const onReset = () => {
        setKeyword('');
        clearSearchResult();
    };

    const onRequestFriend = (user: UserData) => {
        updateSearchUser({ ...user, relationshipStatus: 'requested' });
        requestFriend(user._id);
    };

    const onCancelRequestFriend = (user: UserData) => {
        updateSearchUser({ ...user, relationshipStatus: 'stranger' });
        cancelRequest(user._id);
    };

    React.useEffect(() => {
        if (isFocused || isOpenAddFriend) {
            findUsers(keyword);
        }
    }, [keyword, isFocused, isOpenAddFriend]);

    return (
        <div className="app-search-view">
            <SearchBar
                id="app-search-input"
                placeholder={t('search')}
                onFocus={() => setIsFocused(true)}
                onSearch={findUsers}
                onReset={onReset}
                onEndEditing={(value: string) => setKeyword(value)}
            />
            {isFocused ? (
                <Button className="app-search-close" variant="text" onClick={onCloseSearch}>
                    {t('close')}
                </Button>
            ) : (
                <Button
                    variant="text"
                    className="app-search-view-add-contact"
                    title={t('addContact')}
                    onClick={() => setIsOpenAddFriend(true)}>
                    <Icon name="user-plus" />
                </Button>
            )}
            {isFocused && (
                <div className="app-search-result">
                    <div className="app-search-result-title">{t('searchResult')}</div>
                    <div className="app-search-result-list">
                        {searchResult.users?.map((user, index) => (
                            <div
                                className="chat-item"
                                key={index}
                                onClick={() => onClickResult?.(user)}>
                                <img src={user.avatar} className="chat-avatar" />
                                <div className="chat-name">{user.name}</div>
                            </div>
                        ))}
                    </div>
                    {searchResult.users && searchResult.users.length === 0 && keyword.length > 0 && (
                        <div className="app-search-no-result">
                            <img src={noResultLogo} />
                            <div>{t('notFoundResult')}</div>
                        </div>
                    )}
                </div>
            )}
            <Modal
                isOpen={isOpenAddFriend}
                onClose={() => setIsOpenAddFriend(false)}
                title={t('findFriends')}>
                <div className="app-find-friends">
                    <SearchBar
                        placeholder={t('phoneNumber')}
                        containerStyle={{ width: 'auto' }}
                        numberOnly
                        onSearch={findUsers}
                        onReset={onReset}
                        onEndEditing={(value: string) => setKeyword(value)}
                    />
                    <div className="app-find-friends-title">{t('searchResult')}</div>
                    <div>
                        {searchResult.users?.map((user, index) => (
                            <div className="friend-item" key={index}>
                                <div className="chat-item">
                                    <img src={user.avatar} className="chat-avatar" />
                                    <div className="chat-name">{user.name}</div>
                                </div>
                                {user.relationshipStatus === 'stranger' && (
                                    <Button onClick={() => onRequestFriend(user)}>
                                        {t('addFriend')}
                                    </Button>
                                )}
                                {user.relationshipStatus === 'requested' && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => onCancelRequestFriend(user)}>
                                        {t('cancelRequest')}
                                    </Button>
                                )}
                                {user.relationshipStatus === 'friend' && (
                                    <div className="friend-item-check">
                                        <Icon name="check" />
                                        <span>{t('friend')}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {searchResult.users &&
                            searchResult.users.length === 0 &&
                            keyword.length > 0 && (
                                <div className="app-search-no-result">
                                    <img src={noResultLogo} />
                                    <div>{t('notFoundResult')}</div>
                                </div>
                            )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SearchBox;
