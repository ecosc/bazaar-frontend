import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './en.json';
import fa from './fa.json';
import enUS from 'antd/lib/locale/en_US';
import faIR from 'antd/lib/locale/fa_IR';

function getLang() {
  const lang = localStorage.getItem('lang');

  return lang ? lang : 'fa';
}

function changeLanguage(lang) {
  localStorage.setItem('lang', lang);

  window.location.reload();
}

export function getAntLocale() {
  const lang = getLang()

  switch (lang) {
    case 'en':
      return enUS;
    case 'fa':
      return faIR;
  }
}

export function getLocale() {
  const lang = getLang()

  switch (lang) {
    case 'en':
      return 'en-US';
    case 'fa':
      return 'fa-IR';
  }
}

export function getDirection() {
  const lang = getLang()
  switch (lang) {
    case 'en':
      return 'ltr';
    case 'fa':
      return 'rtl';
  }
}

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getLang(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export { changeLanguage };
export default i18n;