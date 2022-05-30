import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../common/components/Dropdown';

const AppSetting = () => {
    const { i18n, t } = useTranslation();
    const languages = [
        {
            label: 'en',
            value: t('en'),
        },
        {
            label: 'vi',
            value: t('vi'),
        },
    ];

    return (
        <div className="app-setting-content">
            <div className="app-setting-language">
                <span>{t('language')}</span>
                <Dropdown
                    options={languages}
                    value={languages.find((lang) => lang.label === i18n.language) || languages[0]}
                    onChange={(lang) => i18n.changeLanguage(lang.label)}
                />
            </div>
        </div>
    );
};

export default AppSetting;
