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
    headlineGradient: 'Ogni Modulo di Cui Hai Bisogno.',
    subheadline: 'Sirvoy gestisce le prenotazioni. Palawan Collective gestisce il resto — personale, inventario, ordini di cibo e approfondimenti — in un sistema connesso per gli operatori di resort.',
    badge1: 'Connesso a Sirvoy per dati di prenotazione in tempo reale',
    badge2: 'Non hai bisogno di ogni modulo dal primo giorno',
    yourTools: 'I Tuoi Strumenti',
  },
  onboarding: {
    tag: 'Per Iniziare',
    title: 'Prime 7 Azioni per Nuovi Proprietari di Resort',
    subtitle: 'Una guida opzionale per aiutarti a iniziare con i passaggi di configurazione più comuni. Ogni azione si collega al modulo pertinente.',
    footer: 'Questa checklist è solo informativa. Il progresso non viene tracciato e il completamento è opzionale.',
    items: {
      connectSirvoy: {
        title: 'Connetti Sirvoy',
        description: 'Collega il tuo sistema di gestione della proprietà per abilitare il tracciamento dell\'occupazione in tempo reale.',
      },
      setupOccupancy: {
        title: 'Configura Tracciamento Occupazione',
        description: 'Configura i tipi di camera e inizia a monitorare i tassi di occupazione giornalieri.',
      },
      addInventory: {
        title: 'Aggiungi Articoli Inventario',
        description: 'Crea la tua lista iniziale di inventario con livelli di stock e punti di riordino.',
      },
      enableTimesheet: {
        title: 'Abilita Timesheet',
        description: 'Configura i profili dei dipendenti e inizia a tracciare le ore di lavoro.',
      },
      setupFoodOrdering: {
        title: 'Configura Ordini Cibo',
        description: 'Configura le voci del menu e abilita il sistema di ordinazione per gli ospiti.',
      },
      reviewReports: {
        title: 'Rivedi Report',
        description: 'Esplora la dashboard per comprendere i tuoi approfondimenti operativi.',
      },
      trainStaff: {
        title: 'Forma il Personale',
        description: 'Condividi l\'accesso con il tuo team ed esamina insieme le funzionalità chiave.',
      },
    },
  },
  howItWorks: {
    tag: 'Come Funziona',
    title: 'Costruito per Resort Indipendenti',
    subtitle: 'Un sistema modulare che cresce con la tua operazione. Inizia con ciò di cui hai bisogno, aggiungi altro quando sei pronto.',
    features: {
      dataSync: {
        title: 'Sincronizzazione Dati in Tempo Reale',
        description: 'Le prenotazioni Sirvoy fluiscono direttamente nella tua dashboard. Nessun inserimento manuale, nessun ritardo.',
      },
      modular: {
        title: 'Modulare per Design',
        description: 'Abilita solo gli strumenti di cui hai bisogno. Timesheet, inventario, ordini cibo — ognuno funziona indipendentemente.',
      },
      tracking: {
        title: 'Tracciamento Unificato',
        description: 'Visualizza occupazione, personale e costi in un unico posto. Prendi decisioni con visibilità completa.',
      },
    },
  },
  features: {
    tag: 'Strumenti',
    title: 'Tutto Ciò di Cui Hai Bisogno per Gestire il Tuo Resort',
    subtitle: 'Ogni modulo è progettato per funzionare da solo o insieme. Inizia con uno, espandi secondo necessità.',
    learnMore: 'Scopri di Più',
    tools: {
      occupancy: {
        title: 'Tracker Occupazione',
        description: 'Disponibilità camere in tempo reale sincronizzata con Sirvoy. Traccia tariffe giornaliere e prevedi la domanda.',
      },
      timesheet: {
        title: 'Timesheet e Buste Paga',
        description: 'Entrata/uscita, programma turni e calcola buste paga. Si integra con l\'occupazione per l\'analisi dei costi del lavoro.',
      },
      inventory: {
        title: 'Gestione Inventario',
        description: 'Traccia livelli di stock, imposta avvisi di riordino e gestisci fornitori. Riduci sprechi e esaurimenti.',
      },
      foodOrdering: {
        title: 'Sistema Ordini Cibo',
        description: 'Menu rivolto agli ospiti con gestione ordini. Traccia vendite e integra con inventario.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'Scansiona e digitalizza Ricevute di Viaggio Ufficiali. Estrai dati automaticamente per il tracciamento spese.',
      },
      developer: {
        title: 'Strumenti Sviluppatore',
        description: 'Accesso API, webhook e integrazioni personalizzate. Costruisci sulla piattaforma.',
      },
    },
  },
  benefits: {
    tag: 'Perché Sceglierci',
    title: 'Costruito Diversamente',
    subtitle: 'Nessuna tariffa nascosta. Nessun vincolo con il fornitore. Solo strumenti che funzionano.',
    items: {
      noLockIn: {
        title: 'Nessun Vincolo',
        description: 'Esporta i tuoi dati in qualsiasi momento. Cambia fornitore senza perdere la cronologia.',
      },
      modular: {
        title: 'Paga per Quello che Usi',
        description: 'Abilita moduli secondo necessità. Nessun bundle forzato o funzionalità inutilizzate.',
      },
      transparent: {
        title: 'Prezzi Trasparenti',
        description: 'Costi chiari e anticipati. Nessuna tariffa a sorpresa o addebiti nascosti.',
      },
      ownership: {
        title: 'Proprietà dei Dati',
        description: 'I tuoi dati appartengono a te. Capacità di esportazione complete incluse.',
      },
    },
  },
  bestPractices: {
    tag: 'Migliori Pratiche',
    title: 'Suggerimenti dagli Operatori di Resort',
    items: [
      'Inizia con il tracciamento dell\'occupazione prima di aggiungere altri moduli',
      'Forma un membro del personale come amministratore di sistema',
      'Rivedi i report settimanalmente per individuare le tendenze in anticipo',
      'Usa gli avvisi di inventario per prevenire gli esaurimenti',
      'Programma le revisioni delle buste paga nello stesso giorno ogni periodo',
    ],
  },
  faq: {
    tag: 'FAQ',
    title: 'Domande Comuni',
    subtitle: 'Risposte rapide per aiutarti a iniziare.',
    loading: 'Caricamento domande...',
    error: 'Impossibile caricare le domande',
    empty: 'Nessuna domanda disponibile',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Condividi i Tuoi Pensieri',
    subtitle: 'Cerchiamo sempre di migliorare. Facci sapere cosa ne pensi.',
    namePlaceholder: 'Il tuo nome (opzionale)',
    messagePlaceholder: 'Il tuo feedback...',
    submitButton: 'Invia Feedback',
    submitting: 'Invio in corso...',
    successTitle: 'Grazie!',
    successMessage: 'Il tuo feedback è stato inviato.',
    errorTitle: 'Errore',
    errorMessage: 'Impossibile inviare il feedback. Riprova.',
    recentTitle: 'Feedback Recenti',
    anonymous: 'Anonimo',
    noFeedback: 'Nessun feedback ancora',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Operazioni resort, semplificate.',
    builtWith: 'Costruito con',
    termsOfService: 'Termini di Servizio',
    privacyPolicy: 'Politica sulla Privacy',
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
