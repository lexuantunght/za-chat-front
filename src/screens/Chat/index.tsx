import React from 'react';
import { ipcRenderer } from 'electron';
import Button from '../../common/components/Button';

const ChatScreen: React.FC = () => {
    const onClickLogin = () => {
        ipcRenderer.send('login', { name: 'Login' });
    };
    React.useEffect(() => {
        console.log(window.localStorage.getItem('accessToken'));
    }, []);
    return (
        <div>
            <div>chat</div>
        </div>
    );
};

export default ChatScreen;
