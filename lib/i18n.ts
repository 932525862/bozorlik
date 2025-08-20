import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uz from "../locales/uz/common.json";
import en from "../locales/en/common.json";
import ru from "../locales/ru/common.json";

i18n.use(initReactI18next).init({
  resources: {
    uz: { common: uz },
    en: { common: en },
    ru: { common: ru },
  },
  lng: "uz", // boshlang‘ich til
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
