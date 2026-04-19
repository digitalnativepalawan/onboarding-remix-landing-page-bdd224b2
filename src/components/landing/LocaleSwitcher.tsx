import { ChevronDown } from "lucide-react";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors text-xs sm:text-sm px-1.5 py-1">
        <span className="font-medium">{language.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-card border-border">
        {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES[Language]][]).map(
          ([code, lang]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => {}}
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
