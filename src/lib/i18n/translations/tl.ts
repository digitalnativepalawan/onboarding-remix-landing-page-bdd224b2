import type { TranslationKeys } from '../types';

// Tagalog translations (Filipino)
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
    headline: 'Patakbuhin ang Iyong Resort',
    headlineGradient: 'sa Isang Dashboard',
    subheadline: 'Mga booking, staff, pagkain, imbentaryo, at pera — lahat konektado sa real time, ginawa para sa maliliit at off-grid na resort.',
    badge1: 'Konektado sa Cloudbeds para sa real-time na booking data',
    badge2: 'Hindi mo kailangan ang lahat ng module sa unang araw',
    yourTools: 'Mga Tool Mo',
    cloudbedsNote: 'Ang Cloudbeds ang bahala sa mga booking mo. Ang Palawan Collective ang nagpapatakbo ng araw-araw na operasyon.',
    startDemo: 'Magsimula sa Demo Data',
    connectResort: 'I-connect ang Aking Resort',
    trustNote: 'Walang pagbabago sa iyong booking channels. Ikaw ang may kontrol sa iyong data.',
  },
  onboardingStrip: {
    title: 'Mula sa signup hanggang sa tunay na operasyon',
    step1: { title: 'Galugarin', subtitle: 'Demo Mode', description: 'Tingnan ang mga tunay na dashboard na may sample na booking, staff, order, at gastos.' },
    step2: { title: 'Ilagay ang mga Basic', subtitle: '', description: 'Mga unit, staff, menu, at imbentaryo gamit ang simpleng form o CSV upload.' },
    step3: { title: 'Magsimula na', subtitle: '', description: 'I-connect ang Cloudbeds at simulang i-track ang tunay na booking, kita, at payroll.' },
    footer: 'Maaari kang magpalit ng demo at live data anumang oras habang nagse-setup.',
  },
  onboarding: {
    tag: 'Pagsisimula',
    title: 'Unang 7 Aksyon para sa Bagong Resort Owner',
    subtitle: 'Opsyonal na gabay para makapagsimula ka sa mga karaniwang hakbang ng setup. Bawat aksyon ay nakalink sa tamang module.',
    footer: 'Ang checklist na ito ay pang-impormasyon lamang. Hindi sinusubaybayan ang progreso at opsyonal ang pagkumpleto.',
    items: {
      connectCloudbeds: {
        title: 'I-connect ang Cloudbeds',
        description: 'I-link ang iyong property management system para sa real-time na occupancy tracking.',
      },
      setupOccupancy: {
        title: 'I-setup ang Occupancy Tracking',
        description: 'I-configure ang mga room type at simulang bantayan ang araw-araw na occupancy rate.',
      },
      addInventory: {
        title: 'Magdagdag ng Inventory Items',
        description: 'Gumawa ng initial inventory list na may stock levels at reorder points.',
      },
      enableTimesheet: {
        title: 'I-enable ang Timesheet',
        description: 'I-setup ang employee profiles at simulang i-track ang work hours.',
      },
      setupFoodOrdering: {
        title: 'I-setup ang Food Ordering',
        description: 'I-configure ang menu items at i-enable ang guest ordering system.',
      },
      reviewReports: {
        title: 'Tingnan ang Reports',
        description: 'Galugarin ang dashboard para maintindihan ang iyong operational insights.',
      },
      trainStaff: {
        title: 'Turuan ang Staff',
        description: 'Ibahagi ang access sa iyong team at sabay-sabay na pag-aralan ang key features.',
      },
    },
  },
  howItWorks: {
    tag: 'Integration',
    title: 'Paano Ito Gumagana',
    subtitle: 'Ang Cloudbeds ay nagpapadala ng booking data sa Palawan Collective sa real time',
    cloudbedsIntegration: 'Cloudbeds Integration',
    cloudbedsDescription: 'Ang Cloudbeds ang iyong booking engine. Ang Palawan Collective ang iyong operations dashboard. Gumagana sila ng sabay sa pamamagitan ng live webhooks.',
    syncStatus: 'Nagsi-sync sa mga booking channel',
    features: {
      liveWebhooks: {
        title: 'Live Webhooks',
        description: 'Agad na nag-sync ang booking updates',
      },
      multiChannel: {
        title: 'Multi-Channel',
        description: 'Booking.com, Agoda, Airbnb',
      },
      dataExport: {
        title: 'Data Export',
        description: 'Suriin ang guest patterns',
      },
      webhookSlots: {
        title: '10 Webhook Slots',
        description: 'SMS, housekeeping, accounting',
      },
    },
  },
  features: {
    tag: 'Mga Tool',
    title: 'Lahat ng Kailangan Mo',
    subtitle: 'Ginawa para sa mga Palawan resort owner na kailangan ng tunay na kontrol',
    viewDetails: 'Tingnan ang Detalye',
    downloadBitChat: 'I-download ang BitChat',
    tools: {
      occupancy: {
        title: 'Occupancy at Kita',
        description: 'Tingnan ang live occupancy, revenue, expenses, at break-even sa isang tingin.',
      },
      timesheet: {
        title: 'Timesheet at Payroll',
        description: 'Clock-in, tanghalian, clock-out. Automated ang payroll at schedules.',
      },
      inventory: {
        title: 'Inventory',
        description: 'I-track ang supplies, materials, at stock levels sa lahat ng operasyon.',
      },
      foodOrdering: {
        title: 'Online Food Orders',
        description: 'Mobile ordering para sa bisita. Managed ang menu, inventory, at food costs.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'I-scan ang mga resibo mula sa palengke at tindahan. Gumawa ng malinaw na PDF.',
      },
      bitChat: {
        title: 'BitChat',
        description: 'Offline Bluetooth messaging para sa staff. Hindi kailangan ng signal.',
      },
      developer: {
        title: 'Developer Tools',
        description: 'Admin settings at system control para sa power users.',
      },
    },
  },
  benefits: {
    tag: 'Mga Benepisyo',
    title: 'Bakit Ginagamit Ito ng mga Resort Owner',
    subtitle: 'Ginawa para sa mga natatanging hamon ng mga liblib na island resort',
    offlineTitle: 'Offline Communication',
    offlineDescription: 'Kapag nawalan ng internet — at sa Palawan, madalas iyon — pinapanatili ng BitChat na konektado ang iyong staff sa pamamagitan ng Bluetooth mesh.',
    items: {
      maximizeRevenue: {
        title: 'Palakihin ang Kita',
        description: 'Tumutulong ang real-time occupancy na i-optimize ang presyo at bawasan ang mga bakanteng gabi.',
      },
      oneEcosystem: {
        title: 'Isang Ecosystem',
        description: 'Staff, payroll, pagkain, at bisita — tigilan na ang pagpapalit-palit ng apps.',
      },
      automation: {
        title: 'Automation',
        description: 'Awtomatikong tumatakbo ang booking sync, receipt scanning, at payroll.',
      },
      accuracy: {
        title: 'Accuracy',
        description: 'Binabawasan ng OTR receipts at automated calculations ang mga manual na error.',
      },
    },
  },
  bestPractices: {
    tag: 'Mga Tip',
    title: 'Best Practices',
    subtitle: 'Sulitin ang iyong dashboard',
    items: {
      editBookings: 'I-edit ang bookings sa Cloudbeds — awtomatikong mag-a-update ang dashboard',
      useOtrScan: 'Gamitin ang OTR Scan sa bawat pagbili para ma-track ang expenses',
      updateExpenses: 'I-update ang expenses monthly para sa tumpak na profit tracking',
      useScheduling: 'Gamitin ang scheduling tools araw-araw para sa staff coordination',
      monitorFood: 'Bantayan ang food inventory para maiwasan ang stockouts',
      reviewOccupancy: 'Tingnan ang occupancy heatmap lingguhan para i-optimize ang presyo',
    },
  },
  faq: {
    tag: 'FAQ',
    title: 'Mga Karaniwang Tanong',
    subtitle: 'Mabilis na sagot para sa mga Palawan resort owner',
    loading: 'Naglo-load ng mga tanong...',
    error: 'Hindi na-load ang mga tanong',
    empty: 'Walang available na tanong',
    fallbackNotice: 'Ang mga FAQ ay kasalukuyang ipinapakita sa Ingles. Malapit nang magkaroon ng mga pagsasalin.',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Ibahagi ang Iyong Saloobin',
    subtitle: 'Tulungan kaming pahusayin ang platform',
    nameLabel: 'Pangalan (opsyonal)',
    namePlaceholder: 'Pangalan mo',
    feedbackLabel: 'Iyong Feedback',
    messagePlaceholder: 'Ano ang gusto mong mapabuti?',
    submitButton: 'I-submit',
    submitting: 'Nagsu-submit...',
    successTitle: 'Salamat sa iyong feedback!',
    errorTitle: 'Hindi na-submit',
    emptyValidation: 'Pakilagay ang iyong feedback',
    recentTitle: 'Mga Kamakailang Feedback',
    anonymous: 'Anonymous',
    noFeedback: 'Wala pang feedback. Maging una!',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Resort operations software para sa Palawan',
    products: 'Mga Produkto',
    integration: 'Integration',
    legal: 'Legal',
    poweredBy: 'Powered by',
    terms: 'Terms',
    privacy: 'Privacy',
    security: 'Security',
    copyright: '© {year} Palawan Collective Inc.',
  },
  common: {
    loading: 'Naglo-load...',
    error: 'May error na nangyari',
    retry: 'Subukan Muli',
    close: 'Isara',
    save: 'I-save',
    cancel: 'Kanselahin',
    confirm: 'Kumpirmahin',
    delete: 'Burahin',
    edit: 'I-edit',
    add: 'Idagdag',
    search: 'Maghanap',
    noResults: 'Walang resulta',
  },
};
