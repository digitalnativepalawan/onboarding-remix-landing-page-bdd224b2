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
    sirvoyNote: string;
    startDemo: string;
    connectResort: string;
    trustNote: string;
  };
  onboardingStrip: {
    title: string;
    step1: { title: string; subtitle: string; description: string };
    step2: { title: string; subtitle: string; description: string };
    step3: { title: string; subtitle: string; description: string };
    footer: string;
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
    sirvoyIntegration: string;
    sirvoyDescription: string;
    syncStatus: string;
    features: {
      liveWebhooks: { title: string; description: string };
      multiChannel: { title: string; description: string };
      dataExport: { title: string; description: string };
      webhookSlots: { title: string; description: string };
    };
  };
  features: {
    tag: string;
    title: string;
    subtitle: string;
    viewDetails: string;
    downloadBitChat: string;
    tools: {
      occupancy: { title: string; description: string };
      timesheet: { title: string; description: string };
      inventory: { title: string; description: string };
      foodOrdering: { title: string; description: string };
      otrScan: { title: string; description: string };
      bitChat: { title: string; description: string };
      developer: { title: string; description: string };
    };
  };
  benefits: {
    tag: string;
    title: string;
    subtitle: string;
    offlineTitle: string;
    offlineDescription: string;
    items: {
      maximizeRevenue: { title: string; description: string };
      oneEcosystem: { title: string; description: string };
      automation: { title: string; description: string };
      accuracy: { title: string; description: string };
    };
  };
  bestPractices: {
    tag: string;
    title: string;
    subtitle: string;
    items: {
      editBookings: string;
      useOtrScan: string;
      updateExpenses: string;
      useScheduling: string;
      monitorFood: string;
      reviewOccupancy: string;
    };
  };
  faq: {
    tag: string;
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    empty: string;
    fallbackNotice: string;
  };
  feedback: {
    tag: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    feedbackLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    errorTitle: string;
    emptyValidation: string;
    recentTitle: string;
    anonymous: string;
    noFeedback: string;
  };
  footer: {
    brand: string;
    tagline: string;
    products: string;
    integration: string;
    legal: string;
    poweredBy: string;
    terms: string;
    privacy: string;
    security: string;
    copyright: string;
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
