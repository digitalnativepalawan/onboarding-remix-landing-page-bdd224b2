import type { TranslationKeys } from '../types';

// Italian translations
export const it: TranslationKeys = {
  header: {
    adminAccess: 'Accesso Admin',
    enterPasskey: 'Inserisci Passkey',
    passkeyPlaceholder: 'Inserisci passkey',
    accessSettings: 'Accedi alle Impostazioni',
    incorrectPasskey: 'Passkey non corretta',
    settings: 'Impostazioni',
    cancel: 'Annulla',
  },
  hero: {
    headline: 'Un Sistema.',
    headlineGradient: 'Ogni Modulo di cui Hai Bisogno.',
    subheadline: 'Sirvoy gestisce le prenotazioni. Palawan Collective gestisce tutto il resto — personale, finanze, cibo, inventario e operazioni quotidiane. Inizia con ciò di cui hai bisogno. Aggiungi altro man mano che cresci.',
    badge1: 'Collegato a Sirvoy per dati di prenotazione in tempo reale',
    badge2: 'Non hai bisogno di ogni modulo dal primo giorno',
    yourTools: 'I Tuoi Strumenti',
  },
  onboarding: {
    tag: 'Per Iniziare',
    title: 'Prime 7 Azioni per Nuovi Proprietari di Resort',
    subtitle: 'Una guida opzionale per iniziare con i passaggi di configurazione più comuni. Ogni azione si collega al modulo pertinente.',
    footer: 'Questa checklist è solo informativa. Il progresso non viene tracciato e il completamento è opzionale.',
    items: {
      connectSirvoy: {
        title: 'Collega Sirvoy',
        description: 'Collega il tuo sistema di gestione proprietà per abilitare il tracciamento occupazione in tempo reale.',
      },
      setupOccupancy: {
        title: 'Configura Tracciamento Occupazione',
        description: 'Configura i tipi di camera e inizia a monitorare i tassi di occupazione giornalieri.',
      },
      addInventory: {
        title: 'Aggiungi Articoli Inventario',
        description: 'Crea la tua lista inventario iniziale con livelli di stock e punti di riordino.',
      },
      enableTimesheet: {
        title: 'Abilita Foglio Presenze',
        description: 'Configura i profili dipendenti e inizia a tracciare le ore lavorative.',
      },
      setupFoodOrdering: {
        title: 'Configura Ordinazioni Cibo',
        description: 'Configura le voci del menu e abilita il sistema di ordinazione per gli ospiti.',
      },
      reviewReports: {
        title: 'Rivedi Report',
        description: 'Esplora la dashboard per comprendere i tuoi insight operativi.',
      },
      trainStaff: {
        title: 'Forma il Personale',
        description: 'Condividi l\'accesso con il tuo team e analizza insieme le funzionalità chiave.',
      },
    },
  },
  howItWorks: {
    tag: 'Integrazione',
    title: 'Come Funziona',
    subtitle: 'Sirvoy invia i dati di prenotazione a Palawan Collective in tempo reale',
    sirvoyIntegration: 'Integrazione Sirvoy',
    sirvoyDescription: 'Sirvoy è il tuo motore di prenotazione. Palawan Collective è la tua dashboard operativa. Lavorano insieme attraverso webhook live.',
    syncStatus: 'Sincronizzazione con i canali di prenotazione',
    features: {
      liveWebhooks: {
        title: 'Webhook Live',
        description: 'Gli aggiornamenti delle prenotazioni si sincronizzano istantaneamente',
      },
      multiChannel: {
        title: 'Multi-Canale',
        description: 'Booking.com, Agoda, Airbnb',
      },
      dataExport: {
        title: 'Esporta Dati',
        description: 'Analizza i pattern degli ospiti',
      },
      webhookSlots: {
        title: '10 Slot Webhook',
        description: 'SMS, pulizie, contabilità',
      },
    },
  },
  features: {
    tag: 'Strumenti',
    title: 'Tutto Ciò di cui Hai Bisogno',
    subtitle: 'Costruito per i proprietari di resort Palawan che necessitano di vero controllo',
    viewDetails: 'Vedi Dettagli',
    downloadBitChat: 'Scarica BitChat',
    tools: {
      occupancy: {
        title: 'Occupazione e Profitto',
        description: 'Visualizza occupazione live, ricavi, spese e break-even a colpo d\'occhio.',
      },
      timesheet: {
        title: 'Foglio Presenze e Buste Paga',
        description: 'Entrata, pranzo, uscita. Buste paga e turni automatizzati.',
      },
      inventory: {
        title: 'Inventario',
        description: 'Traccia forniture, materiali e livelli di stock in tutte le operazioni.',
      },
      foodOrdering: {
        title: 'Ordini Cibo Online',
        description: 'Ordinazione mobile per ospiti. Menu, inventario e costi cibo gestiti.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'Scansiona ricevute da mercati e negozi. Genera PDF puliti.',
      },
      bitChat: {
        title: 'BitChat',
        description: 'Messaggistica Bluetooth offline per il personale. Nessun segnale richiesto.',
      },
      developer: {
        title: 'Strumenti Sviluppatore',
        description: 'Impostazioni admin e controllo sistema per utenti avanzati.',
      },
    },
  },
  benefits: {
    tag: 'Benefici',
    title: 'Perché i Proprietari di Resort lo Usano',
    subtitle: 'Costruito per le sfide uniche dei resort su isole remote',
    offlineTitle: 'Comunicazione Offline',
    offlineDescription: 'Quando internet non funziona — e a Palawan succede spesso — BitChat mantiene il tuo personale connesso tramite mesh Bluetooth.',
    items: {
      maximizeRevenue: {
        title: 'Massimizza i Ricavi',
        description: 'L\'occupazione in tempo reale ti aiuta a ottimizzare i prezzi e ridurre le notti vuote.',
      },
      oneEcosystem: {
        title: 'Un Ecosistema',
        description: 'Personale, buste paga, cibo e ospiti — smetti di passare da un\'app all\'altra.',
      },
      automation: {
        title: 'Automazione',
        description: 'Sincronizzazione prenotazioni, scansione ricevute e buste paga automatiche.',
      },
      accuracy: {
        title: 'Precisione',
        description: 'Ricevute OTR e calcoli automatizzati riducono gli errori manuali.',
      },
    },
  },
  bestPractices: {
    tag: 'Suggerimenti',
    title: 'Best Practice',
    subtitle: 'Ottieni il massimo dalla tua dashboard',
    items: {
      editBookings: 'Modifica le prenotazioni in Sirvoy — la dashboard si aggiorna automaticamente',
      useOtrScan: 'Usa OTR Scan per ogni acquisto per tracciare le spese',
      updateExpenses: 'Aggiorna le spese mensilmente per un tracciamento preciso del profitto',
      useScheduling: 'Usa gli strumenti di pianificazione quotidianamente per coordinare il personale',
      monitorFood: 'Monitora l\'inventario cibo per prevenire esaurimenti',
      reviewOccupancy: 'Rivedi la heatmap occupazione settimanalmente per ottimizzare i prezzi',
    },
  },
  faq: {
    tag: 'FAQ',
    title: 'Domande Comuni',
    subtitle: 'Risposte rapide per i proprietari di resort Palawan',
    loading: 'Caricamento domande...',
    error: 'Caricamento domande fallito',
    empty: 'Nessuna domanda disponibile',
    fallbackNotice: 'Le FAQ sono attualmente visualizzate in inglese. Le traduzioni arriveranno presto.',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Condividi i Tuoi Pensieri',
    subtitle: 'Aiutaci a migliorare la piattaforma',
    nameLabel: 'Nome (opzionale)',
    namePlaceholder: 'Il tuo nome',
    feedbackLabel: 'Il Tuo Feedback',
    messagePlaceholder: 'Cosa vorresti vedere migliorato?',
    submitButton: 'Invia',
    submitting: 'Invio in corso...',
    successTitle: 'Grazie per il tuo feedback!',
    errorTitle: 'Invio fallito',
    emptyValidation: 'Per favore inserisci il tuo feedback',
    recentTitle: 'Feedback Recenti',
    anonymous: 'Anonimo',
    noFeedback: 'Nessun feedback ancora. Sii il primo!',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Software per operazioni resort per Palawan',
    products: 'Prodotti',
    integration: 'Integrazione',
    legal: 'Legale',
    poweredBy: 'Powered by',
    terms: 'Termini',
    privacy: 'Privacy',
    security: 'Sicurezza',
    copyright: '© {year} Palawan Collective Inc.',
  },
  common: {
    loading: 'Caricamento...',
    error: 'Si è verificato un errore',
    retry: 'Riprova',
    close: 'Chiudi',
    save: 'Salva',
    cancel: 'Annulla',
    confirm: 'Conferma',
    delete: 'Elimina',
    edit: 'Modifica',
    add: 'Aggiungi',
    search: 'Cerca',
    noResults: 'Nessun risultato trovato',
  },
};
