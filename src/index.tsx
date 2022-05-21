import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ChatScreen from './screens/Chat';

const App: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" component={ChatScreen} />
            </Switch>
        </HashRouter>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
