import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Alert from '../../../common/components/Alert';
import Divider from '../../../common/components/Divider';
import Icon from '../../../common/components/Icon';
import PopupMenu from '../../../common/components/PopupMenu';
import Modal from '../../../common/components/Modal';
import Setting from './Setting';
import Avatar from '../../../common/components/Avatar';
import { UserData } from '../../../domain/model/UserData';
interface SideBarProps {
    userData?: UserData;
    t: CallableFunction;
    onChangeLanguage: (lang: string) => void;
    languages: string[];
    language: string;
    onLogout: () => void;
    onQuitApp: () => void;
}

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

const SideBar = ({
    userData,
    t,
    onChangeLanguage,
    languages,
    language,
    onLogout,
    onQuitApp,
}: SideBarProps) => {
    const history = useHistory();
    const location = useLocation();
    const settingMenuRef = React.useRef<PopupMenu>(null);
    const userMenuRef = React.useRef<PopupMenu>(null);
    const [selectedItem, setSelectedItem] = React.useState(findRouteId(location.pathname));
    const [isShowWarning, setIsShowWarning] = React.useState(false);
    const [isShowSetting, setIsShowSetting] = React.useState(false);
    const [isShowProfile, setIsShowProfile] = React.useState(false);

    const onClickItem = (path: string, id: number, name: string) => {
        setSelectedItem(id);
        history.push(path);
        const sideTab = document.getElementById(`${name}-side-tab-container`);
        if (sideTab?.classList.contains(`${name}-side-tab-container-show`)) {
            sideTab?.classList.remove(`${name}-side-tab-container-show`);
        } else {
            sideTab?.classList.add(`${name}-side-tab-container-show`);
        }
    };

    const MenuContent = ({ isUserContext }: { isUserContext?: boolean }) => (
        <div className="app-sidebar-setting-content">
            <button onClick={() => setIsShowProfile(true)}>
                <Icon name="user" height={22} width={22} />
                <span>{t('account')}</span>
            </button>
            <button onClick={() => setIsShowSetting(true)}>
                <Icon name="setting" height={22} width={22} />
                <span>{t('setting')}</span>
            </button>
            <Divider />
            <button className="app-sidebar-logout" onClick={() => setIsShowWarning(true)}>
                {t('logout')}
            </button>
            {!isUserContext && <button onClick={onQuitApp}>{t('quit')}</button>}
        </div>
    );

    return (
        <div className="app-sidebar">
            <button
                className="app-sidebar-avatar-container"
                onClick={(e) => userMenuRef.current?.toggle(e)}>
                <Avatar src={userData?.avatar} name={userData?.name} />
            </button>
            <div className="app-sidebar-buttons">
                {menuItems.map((item, index) => (
                    <button
                        title={t(item.name)}
                        key={index}
                        className={`app-sidebar-item ${
                            selectedItem === item.id ? 'app-sidebar-selected' : ''
                        }`}
                        onClick={() => onClickItem(item.path, item.id, item.name)}>
                        <Icon name={item.icon} />
                    </button>
                ))}
            </div>
            <button
                title={t('setting')}
                className="app-sidebar-item app-sidebar-setting"
                onClick={(e) => settingMenuRef.current?.toggle(e)}>
                <Icon name="setting" />
            </button>
            <PopupMenu ref={settingMenuRef}>
                <MenuContent />
            </PopupMenu>
            <PopupMenu ref={userMenuRef}>
                <MenuContent isUserContext />
            </PopupMenu>
            <Alert
                title={t('confirmation')}
                content={t('logoutConfirm')}
                isShow={isShowWarning}
                severity="error"
                onClose={() => setIsShowWarning(false)}
                onCancel={() => setIsShowWarning(false)}
                onAccept={onLogout}
                cancelText={t('cancel')}
                acceptText={t('accept')}
            />
            <Modal
                title={t('setting')}
                isOpen={isShowSetting}
                onClose={() => setIsShowSetting(false)}>
                <Setting
                    t={t}
                    onChangeLanguage={onChangeLanguage}
                    language={language}
                    languages={languages}
                />
            </Modal>
            <Modal
                title={t('accountInfo')}
                isOpen={isShowProfile}
                onClose={() => setIsShowProfile(false)}>
                <div className="account-info-container">
                    <Avatar src={userData?.avatar} style={{ width: '5rem', height: '5rem' }} />
                    <h3>{userData?.name}</h3>
                    <div className="account-info-title">{t('baseInfo')}</div>
                    <div className="account-info-base">
                        <div>{`${t('username')}: ${userData?.username}`}</div>
                        <div>{`${t('phoneNumber')}: ${userData?.phoneNumber}`}</div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default React.memo(SideBar);
