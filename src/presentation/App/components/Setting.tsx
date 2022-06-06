import React from 'react';
import Dropdown from '../../../common/components/Dropdown';

interface SettingProps {
    onChangeLanguage: (lang: string) => void;
    t: CallableFunction;
    languages: string[];
    language: string;
}

const Setting = ({ t, languages, onChangeLanguage, language }: SettingProps) => {
    const langOptions = languages.map((lang) => ({ label: lang, value: t(lang) }));

    return (
        <div className="app-setting-content">
            <div className="app-setting-language">
                <span>{t('language')}</span>
                <Dropdown
                    options={langOptions}
                    value={langOptions.find((option) => option.label === language)}
                    onChange={(lang) => onChangeLanguage(lang.label)}
                />
            </div>
        </div>
    );
};

export default Setting;
