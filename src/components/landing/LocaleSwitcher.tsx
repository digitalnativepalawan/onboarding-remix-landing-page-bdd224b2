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
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-foreground transition-colors text-[10px] sm:text-xs">
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="font-medium">{language.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
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
