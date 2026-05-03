import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ka from "@/public/locales/ka/common.json";

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources: { ka: { common: ka } },
        lng: "ka",
        fallbackLng: "ka",
        defaultNS: "common",
        ns: ["common"],
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
        initImmediate: false,
    });
}

export default i18n;

export const withTranslations = async (_locale?: string) => ({ props: {} });
