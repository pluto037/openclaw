export type Locale = "en" | "zh-CN";

let currentLocale: Locale = "en";
const translations: Record<Locale, Record<string, string>> = {
  en: {},
  "zh-CN": {},
};

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function registerTranslations(locale: Locale, data: Record<string, string>) {
  translations[locale] = { ...translations[locale], ...data };
}

export function t(key: string, params?: Record<string, string | number>): string {
  const template = translations[currentLocale]?.[key] || translations["en"]?.[key] || key;
  if (!params) return template;

  return Object.entries(params).reduce((acc, [k, v]) => {
    return acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }, template);
}
