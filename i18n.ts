import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Static import of translation files
import fr from "@/../public/locales/fr/common.json";

i18n.use(initReactI18next).init({
  resources: {
    fr: { common: fr },
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
