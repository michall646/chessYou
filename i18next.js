import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from './i18n/pl.json'
import en from './i18n/en.json'

const resources = {
    en: {
        translation: en,
    },
    pl: {
        translation: pl,
    },
};

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        supportedLngs: ['en', 'pl'],
        interpolation: {
            escapeValue: false,
        },
        cleanCode: true,
        ns: ['translation'],
        defaultNS: 'translation',
        compatibilityJSON: 'v3',
    })
    .then();

export default i18next;