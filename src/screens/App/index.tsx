import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import SocketHelper from '../../utils/helpers/SocketHelper';
import withQueryClient from '../../common/context/withQueryClient';
import UserData from '../../common/models/UserData';
import ChatScreen from '../Chat';
import ContactScreen from '../Contact';
import SideBar from './SideBar';
import { useLocalStorage } from '../../hooks/storage';

const App = () => {
    const userData: UserData = JSON.parse(useLocalStorage().getItem('userData') || '');

    React.useEffect(() => {
        document.title = `ZaChat - ${userData.name}`;
        SocketHelper.getInstance().connect();
    }, []);

    return (
        <HashRouter>
            <div className="app-content">
                <SideBar avatarUrl={userData.avatar} />
                <Switch>
                    <Route path="/contacts" component={ContactScreen} />
                    <Route path="/" component={ChatScreen} />
                </Switch>
            </div>
        </HashRouter>
    );
};

export default withQueryClient(App);
