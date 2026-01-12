import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Language, Currency } from '@/lib/i18n/types';
import { getTranslation, isValidLanguage, getDefaultLanguage } from '@/lib/i18n';
import { formatCurrency as formatCurrencyUtil, isValidCurrency, getDefaultCurrency } from '@/lib/currency';

// Storage keys
const STORAGE_KEYS = {
  LANGUAGE: 'palawan-locale-language',
  CURRENCY: 'palawan-locale-currency',
} as const;

// Context value interface
interface LocaleContextValue {
  // Current language and currency
  language: Language;
  currency: Currency;
  
  // Setters
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  
  // Translation function - use dot notation for nested keys
  // e.g., t('header.adminAccess') or t('hero.headline')
  t: (key: string) => string;
  
  // Currency formatting - converts from PHP and formats
  formatPrice: (amountInPHP: number, options?: { showCode?: boolean }) => string;
}

// Create context with undefined default (will be provided by provider)
const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

// Safe localStorage helpers with fallbacks
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage not available, fail silently
  }
}

// Initialize language from localStorage with safe fallback
function getInitialLanguage(): Language {
  const stored = safeGetItem(STORAGE_KEYS.LANGUAGE);
  if (stored && isValidLanguage(stored)) {
    return stored;
  }
  return getDefaultLanguage(); // 'en'
}

// Initialize currency from localStorage with safe fallback
function getInitialCurrency(): Currency {
  const stored = safeGetItem(STORAGE_KEYS.CURRENCY);
  if (stored && isValidCurrency(stored)) {
    return stored;
  }
  return getDefaultCurrency(); // 'PHP'
}

// Provider component
interface LocaleProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  // Initialize state from localStorage with safe defaults
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [currency, setCurrencyState] = useState<Currency>(getInitialCurrency);

  // Persist language changes to localStorage
  const setLanguage = useCallback((lang: Language) => {
    if (isValidLanguage(lang)) {
      setLanguageState(lang);
      safeSetItem(STORAGE_KEYS.LANGUAGE, lang);
    }
  }, []);

  // Persist currency changes to localStorage
  const setCurrency = useCallback((curr: Currency) => {
    if (isValidCurrency(curr)) {
      setCurrencyState(curr);
      safeSetItem(STORAGE_KEYS.CURRENCY, curr);
    }
  }, []);

  // Translation function - memoized to prevent unnecessary re-renders
  const t = useCallback((key: string): string => {
    return getTranslation(key, language);
  }, [language]);

  // Currency formatting function - memoized
  const formatPrice = useCallback((amountInPHP: number, options?: { showCode?: boolean }): string => {
    return formatCurrencyUtil(amountInPHP, currency, options);
  }, [currency]);

  // Sync with localStorage on mount (handles tab sync scenarios)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.LANGUAGE && e.newValue && isValidLanguage(e.newValue)) {
        setLanguageState(e.newValue);
      }
      if (e.key === STORAGE_KEYS.CURRENCY && e.newValue && isValidCurrency(e.newValue)) {
        setCurrencyState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<LocaleContextValue>(() => ({
    language,
    currency,
    setLanguage,
    setCurrency,
    t,
    formatPrice,
  }), [language, currency, setLanguage, setCurrency, t, formatPrice]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

// Hook to use locale context
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  
  return context;
}

// Optional: Hook for just translation (convenience)
export function useTranslation() {
  const { t, language } = useLocale();
  return { t, language };
}

// Optional: Hook for just currency (convenience)
export function useCurrency() {
  const { formatPrice, currency } = useLocale();
  return { formatPrice, currency };
}
