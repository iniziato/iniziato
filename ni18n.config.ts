import type { Ni18nOptions } from "ni18n";
import ka from "./public/locales/ka/common.json";

export const ni18nConfig: Ni18nOptions = {
  supportedLngs: ["ka"],
  ns: ["common"],
  defaultNS: "common",
  lng: "ka",
  initImmediate: false,
  resources: {
    ka: {
      common: ka,
    },
  },
};
