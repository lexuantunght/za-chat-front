import React from 'react';
import Dropdown from '../../../common/components/Dropdown';
import lightBlue from '../../../common/resources/light_blue.png';
import lightGreen from '../../../common/resources/light_green.png';
import lightRed from '../../../common/resources/light_red.png';
import darkBlue from '../../../common/resources/dark_blue.png';
import useController from '../../../controller/hooks';
import AppController from '../../../controller/AppController';
import { darkModeToggle } from '../../../utils/app/eventHandler';

interface SettingProps {
    onChangeLanguage: (lang: string) => void;
    t: CallableFunction;
    languages: string[];
    language: string;
}

const prefs: Array<Preference> = [
    {
        theme: 'light',
        accent: 'blue',
        icon: lightBlue,
    },
    {
        theme: 'light',
        accent: 'green',
        icon: lightGreen,
    },
    {
        theme: 'light',
        accent: 'red',
        icon: lightRed,
    },
    {
        theme: 'dark',
        accent: 'blue',
        icon: darkBlue,
    },
];

type Preference = {
    theme: 'light' | 'dark';
    accent: 'green' | 'blue' | 'red';
    icon: string;
};

const Setting = ({ t, languages, onChangeLanguage, language }: SettingProps) => {
    const langOptions = languages.map((lang) => ({ label: lang, value: t(lang) }));
    const { changeAccent, changeTheme, useGetState } = useController(AppController);
    const theme = useGetState((state) => state.app.theme);
    const accent = useGetState((state) => state.app.accent);

    const onChangeTheme = (theme: 'dark' | 'light') => {
        document.body.setAttribute('data-theme', theme);
        changeTheme(theme);
        darkModeToggle(theme === 'dark');
    };

    const onChangeAccent = (accent: 'green' | 'blue' | 'red') => {
        document.body.setAttribute('data-accent', accent);
        changeAccent(accent);
    };

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
            <div className="app-setting-theme">
                <span className="preference-title">{t('preferences')}</span>
                <div className="app-list-theme">
                    {prefs.map((perf, index) => (
                        <div
                            key={index}
                            className="theme-selector"
                            onClick={() => {
                                onChangeTheme(perf.theme);
                                onChangeAccent(perf.accent);
                            }}>
                            <img
                                src={perf.icon}
                                style={
                                    perf.accent === accent && perf.theme === theme
                                        ? { borderWidth: 3, borderColor: 'var(--primary)' }
                                        : undefined
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Setting;
