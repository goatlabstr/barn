import i18n from 'i18next';
import en from './en.json';
import tr from './tr.json';
import {initReactI18next} from 'react-i18next';

export const resources = {
    en: {translation : en},
    tr: {translation : tr}
} as const;

i18n.use(initReactI18next).init({
    lng: 'en',
    resources,
});

