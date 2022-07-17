import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import AppController from '../../controller/AppController';
import useController from '../../controller/hooks';
import { logout, quitApp } from '../../utils/app/eventHandler';
import useMultilingual from '../../utils/multilingual';
import ChatScreen from '../Chat';
import ContactScreen from '../Contact';
import SideBar from './components/SideBar';
import Titlebar from './components/Titlebar';

const AppScreen = () => {
    const { t, language, languages, changeLanguage } = useMultilingual();
    const { useGetState, authorize } = useController(AppController);
    const userData = useGetState((state) => state.app.userData);
    const theme = useGetState((state) => state.app.theme);
    const accent = useGetState((state) => state.app.accent);

    React.useEffect(() => {
        document.body.setAttribute('data-accent', accent);
        document.body.setAttribute('data-theme', theme);
        authorize();
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
                    userData={userData}
                />
                <div className="app-tabs">
                    <Titlebar title={userData ? 'ZaChat - ' + userData.name : 'ZaChat'} />
                    <div className="app-tab-item">
                        <Switch>
                            <Route path="/contacts" component={ContactScreen} />
                            <Route path="/" component={ChatScreen} />
                        </Switch>
                    </div>
                </div>
            </div>
        </HashRouter>
    );
};

export default AppScreen;
