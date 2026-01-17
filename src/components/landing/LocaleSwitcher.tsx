import { Globe } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { LANGUAGES, type Language } from "@/lib/i18n/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LocaleSwitcher = () => {
  const { language, setLanguage } = useLocale();

  const currentLanguage = LANGUAGES[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-xs sm:text-sm p-1.5">
        <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="font-medium">{language.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-card border-border">
        {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES[Language]][]).map(
          ([code, lang]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => setLanguage(code)}
              className={language === code ? "bg-accent" : ""}
            >
              <span className="mr-2">{lang.flag}</span>
              <span>{lang.label}</span>
              {language === code && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
