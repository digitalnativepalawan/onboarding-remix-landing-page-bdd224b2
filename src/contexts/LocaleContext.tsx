import { createContext, useContext, ReactNode } from "react";
import { en } from "@/lib/i18n/translations/en";

// Always English — language switching removed
const LocaleContext = createContext({
  language: "en" as const,
  t: (key: string): string => {
    const keys = key.split(".");
    let current: any = en;
    for (const k of keys) {
      if (current === undefined || current === null) return key;
      current = current[k];
    }
    return typeof current === "string" ? current : key;
  },
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = en;
    for (const k of keys) {
      if (current === undefined || current === null) return key;
      current = current[k];
    }
    return typeof current === "string" ? current : key;
  };

  return (
    <LocaleContext.Provider value={{ language: "en", t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useTranslation = () => {
  const { t } = useContext(LocaleContext);
  return { t };
};

export const useLocale = () => {
  const { language } = useContext(LocaleContext);
  return { language, setLanguage: () => {} };
};

export default LocaleContext;
