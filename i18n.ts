import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frTranslations from './locales/fr.json';

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      fr: {
        translation: frTranslations,
      },
    },
    fallbackLng: 'fr', 
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
