import { Globe, DollarSign } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { LANGUAGES, CURRENCIES, type Language, type Currency } from "@/lib/i18n/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const LocaleSwitcher = () => {
  const { language, currency, setLanguage, setCurrency } = useLocale();

  const currentLanguage = LANGUAGES[language];
  const currentCurrency = CURRENCIES[currency];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-foreground transition-colors text-[10px] sm:text-xs">
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="font-medium">{language.toUpperCase()}</span>
        <span className="text-muted-foreground/40">|</span>
        <span className="font-medium">{currency}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Language
        </DropdownMenuLabel>
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
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Currency
        </DropdownMenuLabel>
        {(Object.entries(CURRENCIES) as [Currency, typeof CURRENCIES[Currency]][]).map(
          ([code, curr]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code)}
              className={currency === code ? "bg-accent" : ""}
            >
              <span className="mr-2 font-mono">{curr.symbol}</span>
              <span>{curr.label}</span>
              {currency === code && (
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
