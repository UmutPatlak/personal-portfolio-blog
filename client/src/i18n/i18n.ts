import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import trTranslation from './locales/tr.json';

const STORAGE_KEY = 'portfolio_language';

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
      return savedLang;
    }
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('tr')) {
      return 'tr';
    }
  }
  return 'en';
};

const initialLang = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    tr: { translation: trTranslation },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
