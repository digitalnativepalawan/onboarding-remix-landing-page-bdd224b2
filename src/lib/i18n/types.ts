// Language and Currency types
export type Language = 'en' | 'tl' | 'it' | 'de';
export type Currency = 'PHP' | 'USD' | 'EUR';

// Language metadata for UI
export const LANGUAGES: Record<Language, { label: string; nativeLabel: string; flag: string }> = {
  en: { label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  tl: { label: 'Tagalog', nativeLabel: 'Tagalog', flag: '🇵🇭' },
  it: { label: 'Italian', nativeLabel: 'Italiano', flag: '🇮🇹' },
  de: { label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
};

// Currency metadata for UI
export const CURRENCIES: Record<Currency, { symbol: string; label: string }> = {
  PHP: { symbol: '₱', label: 'Philippine Peso' },
  USD: { symbol: '$', label: 'US Dollar' },
  EUR: { symbol: '€', label: 'Euro' },
};

// Translation keys interface - defines all translatable strings
export interface TranslationKeys {
  header: {
    adminAccess: string;
    enterPasskey: string;
    passkeyPlaceholder: string;
    accessSettings: string;
    incorrectPasskey: string;
    settings: string;
    cancel: string;
  };
  hero: {
    headline: string;
    headlineGradient: string;
    subheadline: string;
    badge1: string;
    badge2: string;
    yourTools: string;
  };
  onboarding: {
    tag: string;
    title: string;
    subtitle: string;
    footer: string;
    items: {
      connectSirvoy: { title: string; description: string };
      setupOccupancy: { title: string; description: string };
      addInventory: { title: string; description: string };
      enableTimesheet: { title: string; description: string };
      setupFoodOrdering: { title: string; description: string };
      reviewReports: { title: string; description: string };
      trainStaff: { title: string; description: string };
    };
  };
  howItWorks: {
    tag: string;
    title: string;
    subtitle: string;
    features: {
      dataSync: { title: string; description: string };
      modular: { title: string; description: string };
      tracking: { title: string; description: string };
    };
  };
  features: {
    tag: string;
    title: string;
    subtitle: string;
    learnMore: string;
    tools: {
      occupancy: { title: string; description: string };
      timesheet: { title: string; description: string };
      inventory: { title: string; description: string };
      foodOrdering: { title: string; description: string };
      otrScan: { title: string; description: string };
      developer: { title: string; description: string };
    };
  };
  benefits: {
    tag: string;
    title: string;
    subtitle: string;
    items: {
      noLockIn: { title: string; description: string };
      modular: { title: string; description: string };
      transparent: { title: string; description: string };
      ownership: { title: string; description: string };
    };
  };
  bestPractices: {
    tag: string;
    title: string;
    items: string[];
  };
  faq: {
    tag: string;
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    empty: string;
  };
  feedback: {
    tag: string;
    title: string;
    subtitle: string;
    namePlaceholder: string;
    messagePlaceholder: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    errorMessage: string;
    recentTitle: string;
    anonymous: string;
    noFeedback: string;
  };
  footer: {
    brand: string;
    tagline: string;
    builtWith: string;
    termsOfService: string;
    privacyPolicy: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    noResults: string;
  };
}
