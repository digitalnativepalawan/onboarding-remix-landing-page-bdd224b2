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
    headline: 'Ein System.',
    headlineGradient: 'Jedes Modul, das Sie brauchen.',
    subheadline: 'Sirvoy verwaltet Buchungen. Palawan Collective verwaltet den Rest — Personal, Inventar, Essensbestellungen und Einblicke — in einem verbundenen System für Resort-Betreiber.',
    badge1: 'Verbunden mit Sirvoy für Echtzeit-Buchungsdaten',
    badge2: 'Sie brauchen nicht jedes Modul am ersten Tag',
    yourTools: 'Ihre Werkzeuge',
  },
  onboarding: {
    tag: 'Erste Schritte',
    title: 'Erste 7 Aktionen für neue Resort-Besitzer',
    subtitle: 'Eine optionale Anleitung, um Ihnen bei den häufigsten Einrichtungsschritten zu helfen. Jede Aktion verlinkt zum entsprechenden Modul.',
    footer: 'Diese Checkliste dient nur zur Information. Der Fortschritt wird nicht verfolgt und der Abschluss ist optional.',
    items: {
      connectSirvoy: {
        title: 'Sirvoy verbinden',
        description: 'Verknüpfen Sie Ihr Property-Management-System, um Echtzeit-Belegungsverfolgung zu aktivieren.',
      },
      setupOccupancy: {
        title: 'Belegungsverfolgung einrichten',
        description: 'Konfigurieren Sie Zimmertypen und beginnen Sie mit der Überwachung der täglichen Belegungsraten.',
      },
      addInventory: {
        title: 'Inventarartikel hinzufügen',
        description: 'Erstellen Sie Ihre erste Inventarliste mit Lagerbeständen und Nachbestellpunkten.',
      },
      enableTimesheet: {
        title: 'Zeiterfassung aktivieren',
        description: 'Richten Sie Mitarbeiterprofile ein und beginnen Sie mit der Erfassung der Arbeitszeiten.',
      },
      setupFoodOrdering: {
        title: 'Essensbestellung einrichten',
        description: 'Konfigurieren Sie Ihre Menüpunkte und aktivieren Sie das Gästebestellsystem.',
      },
      reviewReports: {
        title: 'Berichte überprüfen',
        description: 'Erkunden Sie das Dashboard, um Ihre betrieblichen Einblicke zu verstehen.',
      },
      trainStaff: {
        title: 'Personal schulen',
        description: 'Teilen Sie den Zugang mit Ihrem Team und gehen Sie die wichtigsten Funktionen gemeinsam durch.',
      },
    },
  },
  howItWorks: {
    tag: 'So funktioniert es',
    title: 'Gebaut für unabhängige Resorts',
    subtitle: 'Ein modulares System, das mit Ihrem Betrieb wächst. Beginnen Sie mit dem, was Sie brauchen, fügen Sie mehr hinzu, wenn Sie bereit sind.',
    features: {
      dataSync: {
        title: 'Echtzeit-Datensynchronisation',
        description: 'Sirvoy-Buchungen fließen direkt in Ihr Dashboard. Keine manuelle Eingabe, keine Verzögerungen.',
      },
      modular: {
        title: 'Modular gestaltet',
        description: 'Aktivieren Sie nur die Werkzeuge, die Sie brauchen. Zeiterfassung, Inventar, Essensbestellung — jedes funktioniert unabhängig.',
      },
      tracking: {
        title: 'Einheitliche Verfolgung',
        description: 'Sehen Sie Belegung, Personal und Kosten an einem Ort. Treffen Sie Entscheidungen mit vollständiger Übersicht.',
      },
    },
  },
  features: {
    tag: 'Werkzeuge',
    title: 'Alles, was Sie brauchen, um Ihr Resort zu betreiben',
    subtitle: 'Jedes Modul ist so konzipiert, dass es allein oder zusammen funktioniert. Beginnen Sie mit einem, erweitern Sie nach Bedarf.',
    learnMore: 'Mehr erfahren',
    tools: {
      occupancy: {
        title: 'Belegungs-Tracker',
        description: 'Echtzeit-Zimmerverfügbarkeit synchronisiert mit Sirvoy. Verfolgen Sie tägliche Raten und prognostizieren Sie die Nachfrage.',
      },
      timesheet: {
        title: 'Zeiterfassung & Gehaltsabrechnung',
        description: 'Ein-/Ausstempeln, Schichten planen und Gehälter berechnen. Integriert sich mit der Belegung für Arbeitskostenanalyse.',
      },
      inventory: {
        title: 'Inventarverwaltung',
        description: 'Verfolgen Sie Lagerbestände, setzen Sie Nachbestellwarnungen und verwalten Sie Lieferanten. Reduzieren Sie Verschwendung und Engpässe.',
      },
      foodOrdering: {
        title: 'Essensbestellsystem',
        description: 'Gästezugewandtes Menü mit Bestellverwaltung. Verfolgen Sie Verkäufe und integrieren Sie mit dem Inventar.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'Scannen und digitalisieren Sie offizielle Reisebelege. Extrahieren Sie Daten automatisch für die Ausgabenverfolgung.',
      },
      developer: {
        title: 'Entwicklerwerkzeuge',
        description: 'API-Zugang, Webhooks und benutzerdefinierte Integrationen. Bauen Sie auf der Plattform auf.',
      },
    },
  },
  benefits: {
    tag: 'Warum uns wählen',
    title: 'Anders gebaut',
    subtitle: 'Keine versteckten Gebühren. Keine Anbieterbindung. Nur Werkzeuge, die funktionieren.',
    items: {
      noLockIn: {
        title: 'Keine Bindung',
        description: 'Exportieren Sie Ihre Daten jederzeit. Wechseln Sie Anbieter, ohne die Historie zu verlieren.',
      },
      modular: {
        title: 'Zahlen Sie für das, was Sie nutzen',
        description: 'Aktivieren Sie Module nach Bedarf. Keine erzwungenen Pakete oder ungenutzte Funktionen.',
      },
      transparent: {
        title: 'Transparente Preise',
        description: 'Klare, vorab bekannte Kosten. Keine Überraschungsgebühren oder versteckten Kosten.',
      },
      ownership: {
        title: 'Dateneigentum',
        description: 'Ihre Daten gehören Ihnen. Vollständige Exportfunktionen inklusive.',
      },
    },
  },
  bestPractices: {
    tag: 'Best Practices',
    title: 'Tipps von Resort-Betreibern',
    items: [
      'Beginnen Sie mit der Belegungsverfolgung, bevor Sie andere Module hinzufügen',
      'Schulen Sie ein Teammitglied als Systemadministrator',
      'Überprüfen Sie Berichte wöchentlich, um Trends früh zu erkennen',
      'Verwenden Sie Inventarwarnungen, um Engpässe zu vermeiden',
      'Planen Sie Gehaltsabrechnungsprüfungen am selben Tag jeder Periode',
    ],
  },
  faq: {
    tag: 'FAQ',
    title: 'Häufige Fragen',
    subtitle: 'Schnelle Antworten, um Ihnen den Einstieg zu erleichtern.',
    loading: 'Fragen werden geladen...',
    error: 'Fragen konnten nicht geladen werden',
    empty: 'Keine Fragen verfügbar',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Teilen Sie Ihre Gedanken',
    subtitle: 'Wir suchen immer nach Verbesserungsmöglichkeiten. Lassen Sie uns wissen, was Sie denken.',
    namePlaceholder: 'Ihr Name (optional)',
    messagePlaceholder: 'Ihr Feedback...',
    submitButton: 'Feedback senden',
    submitting: 'Wird gesendet...',
    successTitle: 'Vielen Dank!',
    successMessage: 'Ihr Feedback wurde übermittelt.',
    errorTitle: 'Fehler',
    errorMessage: 'Feedback konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
    recentTitle: 'Aktuelles Feedback',
    anonymous: 'Anonym',
    noFeedback: 'Noch kein Feedback',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Resort-Betrieb, vereinfacht.',
    builtWith: 'Gebaut mit',
    termsOfService: 'Nutzungsbedingungen',
    privacyPolicy: 'Datenschutzrichtlinie',
  },
  common: {
    loading: 'Wird geladen...',
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
