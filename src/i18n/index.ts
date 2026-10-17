import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es/common.json";
import en from "./locales/en/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng.startsWith("en") ? "en" : "es";
};
syncHtmlLang(i18n.resolvedLanguage ?? i18n.language ?? "es");
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
