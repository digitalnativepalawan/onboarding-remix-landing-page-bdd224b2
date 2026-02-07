import type { TranslationKeys } from '../types';

// German translations
export const de: TranslationKeys = {
  header: {
    adminAccess: 'Admin-Zugang',
    enterPasskey: 'Passkey eingeben',
    passkeyPlaceholder: 'Passkey eingeben',
    accessSettings: 'Einstellungen öffnen',
    incorrectPasskey: 'Falscher Passkey',
    settings: 'Einstellungen',
    cancel: 'Abbrechen',
  },
  hero: {
    headline: 'Führen Sie Ihr Resort',
    headlineGradient: 'in einem Dashboard',
    subheadline: 'Buchungen, Personal, Essen, Inventar und Finanzen — alles in Echtzeit verbunden, entwickelt für kleine und netzunabhängige Resorts.',
    badge1: 'Mit Cloudbeds für Echtzeit-Buchungsdaten verbunden',
    badge2: 'Sie brauchen nicht jedes Modul am ersten Tag',
    yourTools: 'Ihre Werkzeuge',
    cloudbedsNote: 'Cloudbeds verwaltet Ihre Buchungen. Palawan Collective führt Ihren täglichen Betrieb.',
    startDemo: 'Mit Demo-Daten starten',
    connectResort: 'Mein Resort verbinden',
    trustNote: 'Keine Änderungen an Ihren Buchungskanälen. Sie behalten die Kontrolle über Ihre Daten.',
  },
  onboardingStrip: {
    title: 'Von der Anmeldung zum echten Betrieb',
    step1: { title: 'Erkunden', subtitle: 'Demo-Modus', description: 'Sehen Sie echte Dashboards mit Beispielbuchungen, Personal, Bestellungen und Ausgaben.' },
    step2: { title: 'Grundlagen hinzufügen', subtitle: '', description: 'Einheiten, Personal, Menü und Inventar mit einfachen Formularen oder CSV-Upload.' },
    step3: { title: 'Live gehen', subtitle: '', description: 'Cloudbeds verbinden und echte Buchungen, Gewinn und Lohnabrechnung verfolgen.' },
    footer: 'Sie können beim Einrichten jederzeit zwischen Demo- und Live-Daten wechseln.',
  },
  onboarding: {
    tag: 'Erste Schritte',
    title: 'Erste 7 Aktionen für neue Resort-Besitzer',
    subtitle: 'Ein optionaler Leitfaden für die häufigsten Einrichtungsschritte. Jede Aktion verlinkt zum relevanten Modul.',
    footer: 'Diese Checkliste dient nur zur Information. Der Fortschritt wird nicht verfolgt und die Fertigstellung ist optional.',
    items: {
      connectCloudbeds: {
        title: 'Cloudbeds verbinden',
        description: 'Verbinden Sie Ihr Property-Management-System für Echtzeit-Belegungsverfolgung.',
      },
      setupOccupancy: {
        title: 'Belegungsverfolgung einrichten',
        description: 'Konfigurieren Sie Zimmertypen und überwachen Sie die täglichen Belegungsraten.',
      },
      addInventory: {
        title: 'Inventarartikel hinzufügen',
        description: 'Erstellen Sie Ihre erste Inventarliste mit Beständen und Nachbestellpunkten.',
      },
      enableTimesheet: {
        title: 'Zeiterfassung aktivieren',
        description: 'Richten Sie Mitarbeiterprofile ein und verfolgen Sie Arbeitsstunden.',
      },
      setupFoodOrdering: {
        title: 'Essensbestellung einrichten',
        description: 'Konfigurieren Sie Menüpunkte und aktivieren Sie das Gästebestellsystem.',
      },
      reviewReports: {
        title: 'Berichte prüfen',
        description: 'Erkunden Sie das Dashboard für operative Einblicke.',
      },
      trainStaff: {
        title: 'Personal schulen',
        description: 'Teilen Sie den Zugang mit Ihrem Team und gehen Sie die Hauptfunktionen gemeinsam durch.',
      },
    },
  },
  howItWorks: {
    tag: 'Integration',
    title: 'So funktioniert es',
    subtitle: 'Cloudbeds sendet Buchungsdaten in Echtzeit an Palawan Collective',
    cloudbedsIntegration: 'Cloudbeds-Integration',
    cloudbedsDescription: 'Cloudbeds ist Ihre Buchungsmaschine. Palawan Collective ist Ihr Betriebs-Dashboard. Sie arbeiten über Live-Webhooks zusammen.',
    syncStatus: 'Synchronisierung mit Buchungskanälen',
    features: {
      liveWebhooks: {
        title: 'Live-Webhooks',
        description: 'Buchungsaktualisierungen werden sofort synchronisiert',
      },
      multiChannel: {
        title: 'Multi-Channel',
        description: 'Booking.com, Agoda, Airbnb',
      },
      dataExport: {
        title: 'Datenexport',
        description: 'Gästemuster analysieren',
      },
      webhookSlots: {
        title: '10 Webhook-Slots',
        description: 'SMS, Housekeeping, Buchhaltung',
      },
    },
  },
  features: {
    tag: 'Werkzeuge',
    title: 'Alles was Sie brauchen',
    subtitle: 'Entwickelt für Palawan-Resort-Besitzer, die echte Kontrolle brauchen',
    viewDetails: 'Details anzeigen',
    downloadBitChat: 'BitChat herunterladen',
    tools: {
      occupancy: {
        title: 'Belegung & Gewinn',
        description: 'Sehen Sie Live-Belegung, Einnahmen, Ausgaben und Break-even auf einen Blick.',
      },
      timesheet: {
        title: 'Zeiterfassung & Lohnabrechnung',
        description: 'Ein- und Ausstempeln, Mittagspause. Lohnabrechnung und Dienstpläne automatisiert.',
      },
      inventory: {
        title: 'Inventar',
        description: 'Verfolgen Sie Vorräte, Materialien und Bestände über alle Betriebe.',
      },
      foodOrdering: {
        title: 'Online-Essensbestellungen',
        description: 'Mobile Bestellung für Gäste. Menü, Inventar und Lebensmittelkosten verwaltet.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'Scannen Sie Quittungen von Märkten und Geschäften. Erstellen Sie saubere PDFs.',
      },
      bitChat: {
        title: 'BitChat',
        description: 'Offline-Bluetooth-Nachrichten für Personal. Kein Signal erforderlich.',
      },
      developer: {
        title: 'Entwicklertools',
        description: 'Admin-Einstellungen und Systemsteuerung für Power-User.',
      },
    },
  },
  benefits: {
    tag: 'Vorteile',
    title: 'Warum Resort-Besitzer es nutzen',
    subtitle: 'Entwickelt für die einzigartigen Herausforderungen abgelegener Inselresorts',
    offlineTitle: 'Offline-Kommunikation',
    offlineDescription: 'Wenn das Internet ausfällt — und auf Palawan passiert das oft — hält BitChat Ihr Personal über Bluetooth-Mesh verbunden.',
    items: {
      maximizeRevenue: {
        title: 'Einnahmen maximieren',
        description: 'Echtzeit-Belegung hilft, Preise zu optimieren und leere Nächte zu reduzieren.',
      },
      oneEcosystem: {
        title: 'Ein Ökosystem',
        description: 'Personal, Lohnabrechnung, Essen und Gäste — hören Sie auf, zwischen Apps zu wechseln.',
      },
      automation: {
        title: 'Automatisierung',
        description: 'Buchungssynchronisierung, Quittungsscanning und Lohnabrechnung laufen automatisch.',
      },
      accuracy: {
        title: 'Genauigkeit',
        description: 'OTR-Quittungen und automatische Berechnungen reduzieren manuelle Fehler.',
      },
    },
  },
  bestPractices: {
    tag: 'Tipps',
    title: 'Best Practices',
    subtitle: 'Holen Sie das Beste aus Ihrem Dashboard',
    items: {
      editBookings: 'Buchungen in Cloudbeds bearbeiten — Dashboard aktualisiert sich automatisch',
      useOtrScan: 'OTR Scan für jeden Einkauf nutzen, um Ausgaben zu verfolgen',
      updateExpenses: 'Ausgaben monatlich aktualisieren für genaue Gewinnverfolgung',
      useScheduling: 'Planungstools täglich für Personalkoordination nutzen',
      monitorFood: 'Lebensmittelinventar überwachen, um Engpässe zu vermeiden',
      reviewOccupancy: 'Belegungs-Heatmap wöchentlich prüfen, um Preise zu optimieren',
    },
  },
  faq: {
    tag: 'FAQ',
    title: 'Häufige Fragen',
    subtitle: 'Schnelle Antworten für Palawan-Resort-Besitzer',
    loading: 'Fragen werden geladen...',
    error: 'Fragen konnten nicht geladen werden',
    empty: 'Keine Fragen verfügbar',
    fallbackNotice: 'FAQs werden derzeit auf Englisch angezeigt. Übersetzungen folgen in Kürze.',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Teilen Sie Ihre Gedanken',
    subtitle: 'Helfen Sie uns, die Plattform zu verbessern',
    nameLabel: 'Name (optional)',
    namePlaceholder: 'Ihr Name',
    feedbackLabel: 'Ihr Feedback',
    messagePlaceholder: 'Was möchten Sie verbessert sehen?',
    submitButton: 'Absenden',
    submitting: 'Wird gesendet...',
    successTitle: 'Danke für Ihr Feedback!',
    errorTitle: 'Senden fehlgeschlagen',
    emptyValidation: 'Bitte geben Sie Ihr Feedback ein',
    recentTitle: 'Neuestes Feedback',
    anonymous: 'Anonym',
    noFeedback: 'Noch kein Feedback. Seien Sie der Erste!',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Resort-Betriebssoftware für Palawan',
    products: 'Produkte',
    integration: 'Integration',
    legal: 'Rechtliches',
    poweredBy: 'Powered by',
    terms: 'AGB',
    privacy: 'Datenschutz',
    security: 'Sicherheit',
    copyright: '© {year} Palawan Collective Inc.',
  },
  common: {
    loading: 'Laden...',
    error: 'Ein Fehler ist aufgetreten',
    retry: 'Erneut versuchen',
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suchen',
    noResults: 'Keine Ergebnisse gefunden',
  },
};
