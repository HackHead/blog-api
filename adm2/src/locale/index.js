import { createI18n } from 'react-router-i18n';

// Array of supported locales
// The first in the array is treated as the default locale
const locales = ['ru', 'en', 'es', 'ar', 'pl', 'de'];

// Dictionary of translations
const translations = {
  en: {
    hello: 'Hello',
  },
  fr: {
    hello: 'Bonjour',
  }
}

const I18n = createI18n(
  locales,
  translations,
);

export default I18n;