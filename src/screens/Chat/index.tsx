import React from 'react';
import { ipcRenderer } from 'electron';
import Button from '../../common/components/Button';

const ChatScreen: React.FC = () => {
    const onClickLogin = () => {
        ipcRenderer.send('login', { name: 'Login' });
    };
    return (
        <div>
            <div>chat</div>
            <Button onClick={onClickLogin}>go to login</Button>
        </div>
    );
};

export default ChatScreen;
