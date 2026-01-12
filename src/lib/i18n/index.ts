import type { Language, TranslationKeys } from './types';
import { en } from './translations/en';
import { tl } from './translations/tl';
import { it } from './translations/it';
import { de } from './translations/de';

// All translations mapped by language code
const translations: Record<Language, TranslationKeys> = {
  en,
  tl,
  it,
  de,
};

/**
 * Get a nested value from an object using dot notation
 * e.g., getNestedValue(obj, 'header.adminAccess')
 */
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Get translation for a key in a specific language
 * Falls back to English if translation is missing
 */
export function getTranslation(key: string, language: Language): string {
  // Try to get translation in requested language
  const translation = getNestedValue(translations[language], key);
  
  if (translation !== undefined) {
    return translation;
  }

  // Fallback to English
  const englishTranslation = getNestedValue(translations.en, key);
  
  if (englishTranslation !== undefined) {
    return englishTranslation;
  }

  // If no translation found, return the key itself (for debugging)
  console.warn(`Missing translation for key: ${key}`);
  return key;
}

/**
 * Get all translations for a specific language
 */
export function getTranslations(language: Language): TranslationKeys {
  return translations[language] || translations.en;
}

/**
 * Check if a language is valid
 */
export function isValidLanguage(lang: string): lang is Language {
  return ['en', 'tl', 'it', 'de'].includes(lang);
}

/**
 * Get the default language
 */
export function getDefaultLanguage(): Language {
  return 'en';
}

// Re-export types and constants
export * from './types';
export { en, tl, it, de };
