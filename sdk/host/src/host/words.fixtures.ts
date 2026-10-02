import { createInstance, type i18n } from "i18next";

export function wordsInstance(): i18n {
  const instance = createInstance({
    fallbackLng: "en",
    initAsync: false,
    interpolation: { escapeValue: false },
    lng: "en",
    resources: {
      en: {
        "time-off": {
          commands: { failed: "{{count}} requests failed" },
          plugin: { name: "Time off" },
        },
      },
    },
  });

  void instance.init();

  return instance;
}
