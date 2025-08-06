import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Static import of translation files
import fr from "@/../public/locales/fr/common.json";
import en from "@/../public/locales/en/common.json";
import ar from "@/../public/locales/ar/common.json";

i18n.use(initReactI18next).init({
  resources: {
    fr: { common: fr },
    en: { common: en }, // Placeholder for English translations
    ar: { common: ar }, // Placeholder for Arabic translations
  },
  lng: "fr", // default language
  fallbackLng: "fr",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  ns: ["common"],
  defaultNS: "common",
});

export default i18n;
