import React from 'react';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import LoadingMask from '../../common/components/LoadingMask';
import withQueryClient from '../../common/context/withQueryClient';
import { useFetchCurrent } from '../../hooks/authentication';

const AuthLoader: React.FC = () => {
    const { t } = useTranslation();
    const { data: userData, isLoading } = useFetchCurrent();

    const navigateLogin = () => {
        ipcRenderer.send('navigation', 'login');
    };

    const openMainApp = () => {
        ipcRenderer.send('openApp');
    };

    React.useEffect(() => {
        if (!window.localStorage.getItem('accessToken')) {
            navigateLogin();
        }
    }, []);

    React.useEffect(() => {
        if (!isLoading && !userData) {
            navigateLogin();
        }
        if (userData) {
            window.localStorage.setItem('userData', JSON.stringify(userData));
            openMainApp();
        }
    }, [isLoading, userData]);

    return <LoadingMask className="auth-loading" title={t('authenticating')} />;
};

export default withQueryClient(AuthLoader);
