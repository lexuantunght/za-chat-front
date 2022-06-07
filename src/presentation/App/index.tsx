import React from 'react';
import { useSelector } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import AppController from '../../controller/AppController';
import ConversationController from '../../controller/chat/ConversationController';
import useController from '../../controller/hooks';
import { Message } from '../../domain/model/Message';
import { UserData } from '../../domain/model/UserData';
import { logout, quitApp } from '../../utils/app/eventHandler';
import useMultilingual from '../../utils/multilingual';
import ChatScreen from '../Chat';
import ContactSreen from '../Contact';
import SideBar from './components/SideBar';

const AppScreen = () => {
    const { t, language, languages, changeLanguage } = useMultilingual();
    const { userDataSelector } = useController(ConversationController);
    const { authorize, addSocketListener, emitSocket } = useController(AppController);
    const userData = useSelector(userDataSelector);

    React.useEffect(() => {
        authorize();
        addSocketListener('receive-message', (msg: Message, user: UserData) => {
            new Notification(user.name, { body: msg.content, icon: user.avatar });
            emitSocket('action-message', msg, 'received');
        });
    }, []);

    return (
        <HashRouter>
            <div className="app-content">
                <SideBar
                    t={t}
                    language={language}
                    languages={[...languages]}
                    onChangeLanguage={changeLanguage}
                    onLogout={logout}
                    onQuitApp={quitApp}
                    avatarUrl={userData?.avatar}
                />
                <Switch>
                    <Route path="/contacts" component={ContactSreen} />
                    <Route path="/" component={ChatScreen} />
                </Switch>
            </div>
        </HashRouter>
    );
};

export default AppScreen;
