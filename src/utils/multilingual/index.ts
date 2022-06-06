import { useTranslation } from 'react-i18next';

const useMultilingual = (provider = useTranslation().i18n, transFunc = useTranslation().t) => {
    const { language, changeLanguage, languages } = provider;
    return {
        t: transFunc,
        changeLanguage,
        language,
        languages,
    };
};

export default useMultilingual;
