import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import withQueryClient from '../../common/context/withQueryClient';
import UserData from '../../common/models/UserData';
import ChatScreen from '../Chat';
import ContactScreen from '../Contact';
import SideBar from './SideBar';

const App: React.FC = () => {
    const userData: UserData = JSON.parse(window.localStorage.getItem('userData') || '');

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
