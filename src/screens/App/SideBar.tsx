import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Icon from '../../common/components/Icon';
import defaultAvatar from '../../common/resources/default-avatar.png';

type SideBarProps = {
    avatarUrl?: string;
};

const menuItems = [
    {
        id: 0,
        name: 'chat',
        icon: 'message',
        path: '/',
    },
    {
        id: 1,
        name: 'contacts',
        icon: 'contact',
        path: '/contacts',
    },
];

const findRouteId = (pathname: string) => {
    const index = menuItems.findIndex((item) => item.path === pathname);
    if (index >= 0) {
        return index;
    }
    return 0;
};

const SideBar: React.FC<SideBarProps> = ({ avatarUrl }) => {
    const history = useHistory();
    const location = useLocation();
    const [selectedItem, setSelectedItem] = React.useState(findRouteId(location.pathname));

    const onClickItem = (path: string, id: number, name: string) => {
        setSelectedItem(id);
        history.push(path);
        const sideTab = document.getElementById(`${name}-sidetab-container`);
        if (sideTab?.classList.contains(`${name}-sidetab-container-show`)) {
            sideTab?.classList.remove(`${name}-sidetab-container-show`);
        } else {
            sideTab?.classList.add(`${name}-sidetab-container-show`);
        }
    };

    return (
        <div className="app-sidebar">
            <img className="app-sidebar-avatar" src={avatarUrl || defaultAvatar} />
            <div className="app-sidebar-buttons">
                {menuItems.map((item, key) => (
                    <button
                        key={'app-sidebar-item-' + key}
                        className={`app-sidebar-item ${
                            selectedItem === item.id ? 'app-sidebar-selected' : ''
                        }`}
                        onClick={() => onClickItem(item.path, item.id, item.name)}>
                        <Icon name={item.icon} />
                    </button>
                ))}
            </div>
            <button className="app-sidebar-item">
                <Icon name="setting" />
            </button>
        </div>
    );
};

export default SideBar;
