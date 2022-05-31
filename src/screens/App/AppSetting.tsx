import React from 'react';
import Dropdown from '../../common/components/Dropdown';
import { useMultilingual } from '../../hooks/translation';

const AppSetting = () => {
    const { changeLanguage, t, language } = useMultilingual();
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
                    value={languages.find((lang) => lang.label === language) || languages[0]}
                    onChange={(lang) => changeLanguage(lang.label)}
                />
            </div>
        </div>
    );
};

export default AppSetting;
