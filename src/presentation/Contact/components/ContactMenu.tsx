import React from 'react';
import { ObjectID } from 'bson';
import { FiUserPlus, FiUserCheck } from 'react-icons/fi';
import Avatar from '../../../common/components/Avatar';
import ConversationController from '../../../controller/chat/ConversationController';
import MessageController from '../../../controller/chat/MessageController';
import ContactController from '../../../controller/contact/ContactController';
import useController from '../../../controller/hooks';
import { UserData } from '../../../domain/model/UserData';
import SearchBox, { SearchBoxRef } from '../../App/components/SearchBox';

type ContactMenuProps = {
    t: CallableFunction;
};

const ContactMenu = ({ t }: ContactMenuProps) => {
    const searchBoxRef = React.useRef<SearchBoxRef>(null);
    const { useGetState, toggleFriendRequest, toggleChatbox } = useController(ContactController);
    const { selectConversation } = useController(ConversationController);
    const { getMessages } = useController(MessageController);
    const friends = useGetState((state) => state.contact.friends);
    const selectedConversation = useGetState((state) => state.chat.selectedConversation);
    const conversations = useGetState((state) => state.chat.conversations);
    const showFriendRequest = useGetState((state) => state.contact.showFriendRequest);
    const showChatbox = useGetState((state) => state.contact.showChatbox);

    const onClickItem = () => {
        const sideTab = document.getElementById(`contact-side-tab-container`);
        if (sideTab?.classList.contains(`contact-side-tab-container-show`)) {
            sideTab?.classList.remove(`contact-side-tab-container-show`);
        } else {
            sideTab?.classList.add(`contact-side-tab-container-show`);
        }
    };

    const onClickFriend = (contact: UserData) => {
        toggleChatbox(contact._id);
        onClickItem();
        if (selectedConversation?.user._id === contact._id) {
            return;
        }
        const conversation = conversations.find((conv) => conv.user._id === contact._id);
        if (conversation) {
            selectConversation(conversation);
            getMessages(conversation._id);
        } else {
            selectConversation({
                _id: new ObjectID().toString(),
                userId: contact._id,
                user: { ...contact, relationshipStatus: 'friend' },
                isGroup: false,
            });
            getMessages('');
        }
    };

    return (
        <div className="contact-tab">
            <SearchBox t={t} ref={searchBoxRef} />
            <div className="contact-tab-list custom-scroll scrolling">
                <div
                    className="contact-item"
                    onClick={() => searchBoxRef.current?.openAddFriend(true)}>
                    <FiUserPlus size={22} />
                    <span>{t('addFriendByPhone')}</span>
                </div>
                <div
                    className={'contact-item' + (showFriendRequest ? ' contact-item-focused' : '')}
                    onClick={() => toggleFriendRequest(true)}>
                    <FiUserCheck size={22} />
                    <span>{t('friendRequestList')}</span>
                </div>
                <div className="friend-list-title">{t('friend')}</div>
                <div>
                    {friends.map((friend, index) => (
                        <div
                            className={
                                'contact-item' +
                                (showChatbox === friend.userId ? ' contact-item-focused' : '')
                            }
                            key={index}
                            onClick={() => onClickFriend(friend.user)}>
                            <Avatar
                                src={friend.user.avatar}
                                name={friend.user.name}
                                style={{ marginRight: '0.5rem' }}
                            />
                            <span className="chat-name">{friend.user.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactMenu;
