import React from 'react';
import { useFetchContacts, useFetchRequestFriends } from '../../hooks/contact';

const ContactScreen: React.FC = () => {
    const { data: contacts } = useFetchContacts();
    const { data: friendInvitations } = useFetchRequestFriends();

    return <div>contact</div>;
};

export default ContactScreen;
