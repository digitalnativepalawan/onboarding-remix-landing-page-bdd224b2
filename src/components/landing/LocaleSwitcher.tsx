import { useLocale } from "@/contexts/LocaleContext";
import { LANGUAGES, type Language } from "@/lib/i18n/types";

const LocaleSwitcher = () => {
  const { language, setLanguage } = useLocale();

  const languageCodes = Object.keys(LANGUAGES) as Language[];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {languageCodes.map((code, index) => (
        <div key={code} className="flex items-center">
          <button
            onClick={() => setLanguage(code)}
            className={`px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-medium transition-colors rounded ${
              language === code
                ? "text-white bg-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
            aria-label={`Switch to ${LANGUAGES[code].label}`}
            aria-current={language === code ? "true" : undefined}
          >
            {code.toUpperCase()}
          </button>
          {index < languageCodes.length - 1 && (
            <span className="text-white/30 mx-0.5 sm:mx-1">|</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default LocaleSwitcher;
