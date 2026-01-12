import type { Currency } from '../i18n/types';

// Exchange rates relative to PHP (Philippine Peso as base)
// These are approximate rates for display purposes only
// All stored values remain in PHP
const EXCHANGE_RATES: Record<Currency, number> = {
  PHP: 1,
  USD: 0.018,  // 1 PHP ≈ 0.018 USD
  EUR: 0.016,  // 1 PHP ≈ 0.016 EUR
};

// Currency symbols and formatting options
const CURRENCY_CONFIG: Record<Currency, {
  symbol: string;
  locale: string;
  code: string;
}> = {
  PHP: { symbol: '₱', locale: 'en-PH', code: 'PHP' },
  USD: { symbol: '$', locale: 'en-US', code: 'USD' },
  EUR: { symbol: '€', locale: 'de-DE', code: 'EUR' },
};

/**
 * Convert an amount from PHP to the target currency
 * This is for DISPLAY ONLY - all stored values remain in PHP
 */
export function convertFromPHP(amountInPHP: number, targetCurrency: Currency): number {
  const rate = EXCHANGE_RATES[targetCurrency] ?? 1;
  return amountInPHP * rate;
}

/**
 * Convert an amount from target currency back to PHP
 * Useful for input fields where user enters in their preferred currency
 */
export function convertToPHP(amount: number, fromCurrency: Currency): number {
  const rate = EXCHANGE_RATES[fromCurrency] ?? 1;
  if (rate === 0) return amount;
  return amount / rate;
}

/**
 * Format an amount in the specified currency
 * Handles conversion from PHP if the amount is stored in PHP
 * 
 * @param amountInPHP - The amount in PHP (base currency)
 * @param currency - The target currency for display
 * @param options - Optional formatting options
 */
export function formatCurrency(
  amountInPHP: number,
  currency: Currency,
  options?: {
    showCode?: boolean;      // Show currency code (e.g., "₱1,000 PHP")
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const config = CURRENCY_CONFIG[currency] ?? CURRENCY_CONFIG.PHP;
  const convertedAmount = convertFromPHP(amountInPHP, currency);
  
  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: options?.minimumFractionDigits ?? 0,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    }).format(convertedAmount);

    if (options?.showCode) {
      return `${formatted} ${config.code}`;
    }

    return formatted;
  } catch {
    // Fallback formatting if Intl fails
    return `${config.symbol}${convertedAmount.toFixed(2)}`;
  }
}

/**
 * Format a number with proper locale-based separators
 */
export function formatNumber(value: number, currency: Currency): string {
  const config = CURRENCY_CONFIG[currency] ?? CURRENCY_CONFIG.PHP;
  
  try {
    return new Intl.NumberFormat(config.locale).format(value);
  } catch {
    return value.toString();
  }
}

/**
 * Get the symbol for a currency
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_CONFIG[currency]?.symbol ?? '₱';
}

/**
 * Get the exchange rate for a currency (relative to PHP)
 */
export function getExchangeRate(currency: Currency): number {
  return EXCHANGE_RATES[currency] ?? 1;
}

/**
 * Check if a currency is valid
 */
export function isValidCurrency(curr: string): curr is Currency {
  return ['PHP', 'USD', 'EUR'].includes(curr);
}

/**
 * Get the default currency
 */
export function getDefaultCurrency(): Currency {
  return 'PHP';
}

// Re-export Currency type for convenience
export type { Currency };
