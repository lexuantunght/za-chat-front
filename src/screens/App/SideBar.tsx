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
        name: 'Tin nhắn',
        icon: 'message',
        path: '/'
    },
    {
        id: 1,
        name: 'Danh bạ',
        icon: 'contact',
        path: '/contacts'
    }
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

    const onClickItem = (path: string, id: number) => {
        setSelectedItem(id);
        history.push(path);
    };

    return (
        <div className="app-sidebar">
            <img className="app-sidebar-avatar" src={avatarUrl || defaultAvatar} />
            {menuItems.map((item, key) => (
                <button
                    key={'app-sidebar-item-' + key}
                    className={`app-sidebar-item ${selectedItem === item.id ? 'app-sidebar-selected' : ''}`}
                    onClick={() => onClickItem(item.path, item.id)}>
                    <Icon name={item.icon} />
                </button>
            ))}
        </div>
    );
};

export default SideBar;
