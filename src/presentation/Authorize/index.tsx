import React from 'react';
import LoadingMask from '../../common/components/LoadingMask';
import useMultilingual from '../../utils/multilingual';

const Authorize = () => {
    const { t } = useMultilingual();

    return <LoadingMask className="login-auth-loading" title={t('authenticating')} />;
};

export default Authorize;
