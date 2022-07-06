import React from 'react';
import Button from '../../../common/components/Button';
import ContactController from '../../../controller/contact/ContactController';
import useController from '../../../controller/hooks';

interface FriendRequestListProps {
    t: CallableFunction;
}

const FriendRequestList = ({ t }: FriendRequestListProps) => {
    const { useGetState, getFriendInvitations, rejectFriend, acceptFriend } =
        useController(ContactController);
    const friendRequests = useGetState((state) => state.contact.friendRequests);

    React.useEffect(() => {
        getFriendInvitations();
    }, []);

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
                            <img src={request.fromUser.avatar} className="friend-request-avatar" />
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
            </div>
        </div>
    );
};

export default FriendRequestList;
