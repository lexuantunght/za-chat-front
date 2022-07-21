import React from 'react';
import Avatar from '../../../common/components/Avatar';
import Button from '../../../common/components/Button';
import ContactController from '../../../controller/contact/ContactController';
import useController from '../../../controller/hooks';
import { UserData } from '../../../domain/model/UserData';

interface FriendRequestListProps {
    t: CallableFunction;
}

const FriendRequestList = ({ t }: FriendRequestListProps) => {
    const {
        useGetState,
        getFriendInvitations,
        rejectFriend,
        acceptFriend,
        getSuggestContacts,
        requestFriend,
        removeSuggestedContact,
    } = useController(ContactController);
    const friendRequests = useGetState((state) => state.contact.friendRequests);
    const suggestedContacts = useGetState((state) => state.contact.suggestedContacts);

    React.useEffect(() => {
        getFriendInvitations();
        getSuggestContacts();
    }, []);

    const handleAddFriend = (user: UserData) => {
        requestFriend(user._id);
        removeSuggestedContact(user);
    };

    return (
        <div className="friend-request-container">
            <div className="friend-request-list-title">{t('friendRequestList')}</div>
            <div className="friend-request-list custom-scroll scrolling">
                <div className="friend-request-total">{`${t('friendRequests')} (${
                    friendRequests.length
                })`}</div>
                {friendRequests.map((request, index) => (
                    <div key={index} className="friend-request-item">
                        <div>
                            <Avatar
                                src={request.fromUser.avatar}
                                style={{ height: '4rem', width: '4rem' }}
                            />
                            <span>{request.fromUser.name}</span>
                        </div>
                        <div>
                            <Button variant="text" onClick={() => rejectFriend(request.fromUid)}>
                                {t('rejectRequest')}
                            </Button>
                            <Button
                                className="accept-friend"
                                onClick={() => acceptFriend(request.fromUid, request.fromUser)}>
                                {t('accept')}
                            </Button>
                        </div>
                    </div>
                ))}
                <div className="friend-request-total">{t('maybeKnow')}</div>
                <div className="suggest-list">
                    {suggestedContacts.map((contact, index) => (
                        <div key={index} className="suggest-item">
                            <Avatar
                                src={contact.avatar}
                                style={{ height: '4rem', width: '4rem' }}
                            />
                            <span className="suggest-name">{contact.name}</span>
                            <Button onClick={() => handleAddFriend(contact)}>
                                {t('addFriend')}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FriendRequestList;
