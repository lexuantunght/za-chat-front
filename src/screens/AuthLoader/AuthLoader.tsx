import React from 'react';
import { ipcRenderer } from 'electron';
import LoadingMask from '../../common/components/LoadingMask';
import withQueryClient from '../../common/context/withQueryClient';
import { useFetchCurrent } from '../../hooks/authentication';
import { useMultilingual } from '../../hooks/translation';

const AuthLoader: React.FC = () => {
    const { t } = useMultilingual();
    const { isLoading, isSuccess } = useFetchCurrent();

    const navigateLogin = () => {
        ipcRenderer.send('navigation', 'login');
    };

    const openMainApp = () => {
        ipcRenderer.send('openApp');
    };

    React.useEffect(() => {
        if (!isLoading) {
            if (!isSuccess) {
                navigateLogin();
            } else {
                openMainApp();
            }
        }
    }, [isLoading]);

    return <LoadingMask className="auth-loading" title={t('authenticating')} />;
};

export default withQueryClient(AuthLoader);
