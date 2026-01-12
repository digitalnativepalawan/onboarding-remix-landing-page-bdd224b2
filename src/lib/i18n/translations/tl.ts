import type { TranslationKeys } from '../types';

// Tagalog translations
export const tl: TranslationKeys = {
  header: {
    adminAccess: 'Admin Access',
    enterPasskey: 'Ilagay ang Passkey',
    passkeyPlaceholder: 'Ilagay ang passkey',
    accessSettings: 'I-access ang Settings',
    incorrectPasskey: 'Maling passkey',
    settings: 'Settings',
    cancel: 'Kanselahin',
  },
  hero: {
    headline: 'Isang Sistema.',
    headlineGradient: 'Lahat ng Module na Kailangan Mo.',
    subheadline: 'Ang Sirvoy ang humahawak ng mga booking. Ang Palawan Collective ang humahawak sa iba pa — staffing, inventory, food orders, at insights — sa isang konektadong sistema para sa mga resort operator.',
    badge1: 'Konektado sa Sirvoy para sa real-time booking data',
    badge2: 'Hindi mo kailangan ang lahat ng module sa unang araw',
    yourTools: 'Ang Iyong Mga Tools',
  },
  onboarding: {
    tag: 'Pagsisimula',
    title: 'Unang 7 Aksyon para sa Bagong Resort Owners',
    subtitle: 'Opsyonal na gabay para makatulong sa iyo na magsimula sa mga karaniwang setup steps. Bawat aksyon ay naka-link sa kaukulang module.',
    footer: 'Ang checklist na ito ay impormasyon lamang. Hindi sinusubaybayan ang progreso at opsyonal ang pagkumpleto.',
    items: {
      connectSirvoy: {
        title: 'Ikonekta ang Sirvoy',
        description: 'I-link ang iyong property management system para ma-enable ang real-time occupancy tracking.',
      },
      setupOccupancy: {
        title: 'I-setup ang Occupancy Tracking',
        description: 'I-configure ang mga uri ng kwarto at simulan ang pag-monitor ng daily occupancy rates.',
      },
      addInventory: {
        title: 'Magdagdag ng Inventory Items',
        description: 'Gumawa ng iyong initial na listahan ng inventory na may stock levels at reorder points.',
      },
      enableTimesheet: {
        title: 'I-enable ang Timesheet',
        description: 'I-setup ang mga employee profile at simulan ang pag-track ng work hours.',
      },
      setupFoodOrdering: {
        title: 'I-setup ang Food Ordering',
        description: 'I-configure ang iyong menu items at i-enable ang guest ordering system.',
      },
      reviewReports: {
        title: 'Suriin ang mga Reports',
        description: 'Galugarin ang dashboard para maintindihan ang iyong operational insights.',
      },
      trainStaff: {
        title: 'I-train ang Staff',
        description: 'Ibahagi ang access sa iyong team at sabay-sabay na talakayin ang mga pangunahing features.',
      },
    },
  },
  howItWorks: {
    tag: 'Paano Ito Gumagana',
    title: 'Ginawa para sa Independent Resorts',
    subtitle: 'Isang modular na sistema na lumalaki kasama ng iyong operasyon. Magsimula sa kailangan mo, magdagdag pa kapag handa na.',
    features: {
      dataSync: {
        title: 'Real-Time Data Sync',
        description: 'Ang mga Sirvoy booking ay direktang dumadaloy sa iyong dashboard. Walang manual entry, walang delays.',
      },
      modular: {
        title: 'Modular ang Disenyo',
        description: 'I-enable lamang ang mga tools na kailangan mo. Timesheet, inventory, food ordering — bawat isa ay gumagana nang nagsasarili.',
      },
      tracking: {
        title: 'Unified Tracking',
        description: 'Tingnan ang occupancy, staffing, at mga gastos sa isang lugar. Gumawa ng mga desisyon na may kumpletong visibility.',
      },
    },
  },
  features: {
    tag: 'Mga Tools',
    title: 'Lahat ng Kailangan Mo para Patakbuhin ang Iyong Resort',
    subtitle: 'Bawat module ay dinisenyo para gumana nang mag-isa o magkasama. Magsimula sa isa, palawakin kung kinakailangan.',
    learnMore: 'Alamin Pa',
    tools: {
      occupancy: {
        title: 'Occupancy Tracker',
        description: 'Real-time na availability ng kwarto na naka-sync sa Sirvoy. I-track ang daily rates at hulaan ang demand.',
      },
      timesheet: {
        title: 'Timesheet at Payroll',
        description: 'Clock in/out, mag-schedule ng shifts, at kalkulahin ang payroll. Naka-integrate sa occupancy para sa labor cost analysis.',
      },
      inventory: {
        title: 'Inventory Management',
        description: 'I-track ang stock levels, mag-set ng reorder alerts, at pamahalaan ang mga supplier. Bawasan ang waste at stockouts.',
      },
      foodOrdering: {
        title: 'Food Ordering System',
        description: 'Guest-facing menu na may order management. I-track ang sales at i-integrate sa inventory.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'I-scan at i-digitize ang Official Travel Receipts. Awtomatikong i-extract ang data para sa expense tracking.',
      },
      developer: {
        title: 'Developer Tools',
        description: 'API access, webhooks, at custom integrations. Mag-build sa ibabaw ng platform.',
      },
    },
  },
  benefits: {
    tag: 'Bakit Kami Piliin',
    title: 'Ibang-iba ang Pagkakagawa',
    subtitle: 'Walang hidden fees. Walang vendor lock-in. Mga tools lang na gumagana.',
    items: {
      noLockIn: {
        title: 'Walang Lock-In',
        description: 'I-export ang iyong data anumang oras. Lumipat ng providers nang hindi nawawala ang history.',
      },
      modular: {
        title: 'Magbayad sa Ginagamit Mo',
        description: 'I-enable ang mga module kung kinakailangan. Walang sapilitang bundles o hindi nagagamit na features.',
      },
      transparent: {
        title: 'Transparent na Presyo',
        description: 'Malinaw, upfront na mga gastos. Walang surprise fees o hidden charges.',
      },
      ownership: {
        title: 'Pagmamay-ari ng Data',
        description: 'Ang iyong data ay sa iyo. Kasama ang full export capabilities.',
      },
    },
  },
  bestPractices: {
    tag: 'Pinakamahusay na Praktika',
    title: 'Mga Tip mula sa Resort Operators',
    items: [
      'Magsimula sa occupancy tracking bago magdagdag ng ibang modules',
      'Mag-train ng isang staff member bilang system admin',
      'Suriin ang mga reports linggu-linggo para makita agad ang mga trends',
      'Gumamit ng inventory alerts para maiwasan ang stockouts',
      'Mag-schedule ng payroll reviews sa parehong araw sa bawat period',
    ],
  },
  faq: {
    tag: 'FAQ',
    title: 'Mga Karaniwang Tanong',
    subtitle: 'Mabilis na mga sagot para makatulong sa iyong magsimula.',
    loading: 'Naglo-load ng mga tanong...',
    error: 'Hindi na-load ang mga tanong',
    empty: 'Walang available na tanong',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Ibahagi ang Iyong Saloobin',
    subtitle: 'Palagi kaming naghahanap ng paraan para mapabuti. Ipaalam sa amin kung ano ang iniisip mo.',
    namePlaceholder: 'Ang iyong pangalan (opsyonal)',
    messagePlaceholder: 'Ang iyong feedback...',
    submitButton: 'Ipadala ang Feedback',
    submitting: 'Ipinapadala...',
    successTitle: 'Salamat!',
    successMessage: 'Naisumite na ang iyong feedback.',
    errorTitle: 'Error',
    errorMessage: 'Hindi naisumite ang feedback. Pakisubukan ulit.',
    recentTitle: 'Kamakailang Feedback',
    anonymous: 'Anonymous',
    noFeedback: 'Wala pang feedback',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Operasyon ng resort, pinasimple.',
    builtWith: 'Ginawa gamit ang',
    termsOfService: 'Mga Tuntunin ng Serbisyo',
    privacyPolicy: 'Patakaran sa Privacy',
  },
  common: {
    loading: 'Naglo-load...',
    error: 'May naganap na error',
    retry: 'Subukan Muli',
    close: 'Isara',
    save: 'I-save',
    cancel: 'Kanselahin',
    confirm: 'Kumpirmahin',
    delete: 'Burahin',
    edit: 'I-edit',
    add: 'Idagdag',
    search: 'Hanapin',
    noResults: 'Walang nahanap na resulta',
  },
};
