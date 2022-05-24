import React from 'react';
import { ipcRenderer } from 'electron';
import LoadingMask from '../../common/components/LoadingMask';
import withQueryClient from '../../common/context/withQueryClient';
import { useFetchCurrent } from '../../hooks/authentication';

const AuthLoader: React.FC = () => {
    const { data: userData, isLoading } = useFetchCurrent();

    const navigateLogin = () => {
        ipcRenderer.send('navigation', 'login');
    };

    const openMainApp = () => {
        ipcRenderer.send('openApp');
    };

    React.useEffect(() => {
        if (!isLoading && !userData) {
            navigateLogin();
        }
        if (userData) {
            window.localStorage.setItem('userData', JSON.stringify(userData));
            openMainApp();
        }
    }, [isLoading, userData]);

    return <LoadingMask className="auth-loading" title="Đang đăng nhập..." />;
};

export default withQueryClient(AuthLoader);
