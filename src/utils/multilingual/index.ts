import { useTranslation } from 'react-i18next';

const useMultilingual = (provider = useTranslation().i18n, transFunc = useTranslation().t) => {
    const { language, changeLanguage } = provider;
    return {
        t: transFunc,
        changeLanguage,
        language,
    };
};

export default useMultilingual;
