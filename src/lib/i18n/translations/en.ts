import type { TranslationKeys } from '../types';

// English translations - Master file (default)
export const en: TranslationKeys = {
  header: {
    adminAccess: 'Admin Access',
    enterPasskey: 'Enter Passkey',
    passkeyPlaceholder: 'Enter passkey',
    accessSettings: 'Access Settings',
    incorrectPasskey: 'Incorrect passkey',
    settings: 'Settings',
    cancel: 'Cancel',
  },
  hero: {
    headline: 'Run Your Resort',
    headlineGradient: 'in One Dashboard',
    subheadline: 'Bookings, staff, food, inventory, and cash — all connected in real time, built for small and off-grid resorts.',
    badge1: 'Connected to Cloudbeds for real-time booking data',
    badge2: "You don't need every module on day one",
    yourTools: 'Your Tools',
    cloudbedsNote: 'Cloudbeds manages your bookings. Palawan Collective runs your daily operations.',
    startDemo: 'Start with Demo Data',
    connectResort: 'Connect My Resort',
    trustNote: 'No changes to your booking channels. You stay in control of your data.',
  },
  onboardingStrip: {
    title: 'From signup to real operations',
    step1: { title: 'Explore', subtitle: '', description: 'Browse this page to see what tools are available for your resort.' },
    step2: { title: 'Add Your Basics', subtitle: '', description: 'Units, staff, menu, and inventory using simple forms or CSV upload.' },
    step3: { title: 'Go Live', subtitle: '', description: 'Sign up at euro.palawancollective.com/admin and start managing your resort.' },
    footer: 'Everything runs from one account — no separate apps to install.',
  },
  onboarding: {
    tag: 'Getting Started',
    title: 'First 7 Actions for New Resort Owners',
    subtitle: 'An optional guide to help you get started with the most common setup steps. Each action links to the relevant module.',
    footer: 'This checklist is informational only. Progress is not tracked and completion is optional.',
    items: {
      connectCloudbeds: {
        title: 'Connect Cloudbeds',
        description: 'Link your property management system to enable real-time occupancy tracking.',
      },
      setupOccupancy: {
        title: 'Setup Occupancy Tracking',
        description: 'Configure room types and start monitoring daily occupancy rates.',
      },
      addInventory: {
        title: 'Add Inventory Items',
        description: 'Create your initial inventory list with stock levels and reorder points.',
      },
      enableTimesheet: {
        title: 'Enable Timesheet',
        description: 'Set up employee profiles and start tracking work hours.',
      },
      setupFoodOrdering: {
        title: 'Setup Food Ordering',
        description: 'Configure your menu items and enable guest ordering system.',
      },
      reviewReports: {
        title: 'Review Reports',
        description: 'Explore the dashboard to understand your operational insights.',
      },
      trainStaff: {
        title: 'Train Staff',
        description: 'Share access with your team and walk through key features together.',
      },
    },
  },
  howItWorks: {
    tag: 'Integration',
    title: 'How It Works',
    subtitle: 'Cloudbeds sends booking data to Palawan Collective in real time',
    cloudbedsIntegration: 'Cloudbeds Integration',
    cloudbedsDescription: 'Cloudbeds is your booking engine. Palawan Collective is your operations dashboard. They work together through live webhooks.',
    syncStatus: 'Syncing with booking channels',
    features: {
      liveWebhooks: {
        title: 'Live Webhooks',
        description: 'Booking updates sync instantly',
      },
      multiChannel: {
        title: 'Multi-Channel',
        description: 'Booking.com, Agoda, Airbnb',
      },
      dataExport: {
        title: 'Data Export',
        description: 'Analyze guest patterns',
      },
      webhookSlots: {
        title: '10 Webhook Slots',
        description: 'SMS, housekeeping, accounting',
      },
    },
  },
  features: {
    tag: 'Tools',
    title: 'Everything You Need',
    subtitle: 'Built for Palawan resort owners who need real control',
    viewDetails: 'View Details',
    downloadBitChat: 'Download BitChat',
    tools: {
      occupancy: {
        title: 'Occupancy & Profit',
        description: 'See live occupancy, revenue, expenses, and break-even at a glance.',
      },
      timesheet: {
        title: 'Timesheet & Payroll',
        description: 'Clock-in, lunch, clock-out. Payroll and schedules automated.',
      },
      inventory: {
        title: 'Inventory',
        description: 'Track supplies, materials, and stock levels across operations.',
      },
      foodOrdering: {
        title: 'Online Food Orders',
        description: 'Guest mobile ordering. Menu, inventory, and food costs managed.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'Scan receipts from markets and stores. Generate clean PDFs.',
      },
      bitChat: {
        title: 'BitChat',
        description: 'Offline Bluetooth messaging for staff. No signal required.',
      },
      developer: {
        title: 'Developer Tools',
        description: 'Admin settings and system control for power users.',
      },
    },
  },
  benefits: {
    tag: 'Benefits',
    title: 'Why Resort Owners Use It',
    subtitle: 'Built for the unique challenges of remote island resorts',
    offlineTitle: 'Offline Communication',
    offlineDescription: 'When internet fails — and in Palawan, it often does — BitChat keeps your staff connected via Bluetooth mesh.',
    items: {
      maximizeRevenue: {
        title: 'Maximize Revenue',
        description: 'Real-time occupancy helps you optimize pricing and reduce empty nights.',
      },
      oneEcosystem: {
        title: 'One Ecosystem',
        description: 'Staff, payroll, food, and guests — stop switching between apps.',
      },
      automation: {
        title: 'Automation',
        description: 'Booking sync, receipt scanning, and payroll run automatically.',
      },
      accuracy: {
        title: 'Accuracy',
        description: 'OTR receipts and automated calculations reduce manual errors.',
      },
    },
  },
  bestPractices: {
    tag: 'Tips',
    title: 'Best Practices',
    subtitle: 'Get the most out of your dashboard',
    items: {
      editBookings: 'Edit bookings in Cloudbeds — dashboard updates automatically',
      useOtrScan: 'Use OTR Scan for every purchase to track expenses',
      updateExpenses: 'Update expenses monthly for accurate profit tracking',
      useScheduling: 'Use scheduling tools daily for staff coordination',
      monitorFood: 'Monitor food inventory to prevent stockouts',
      reviewOccupancy: 'Review occupancy heatmap weekly to optimize pricing',
    },
  },
  faq: {
    tag: 'FAQ',
    title: 'Common Questions',
    subtitle: 'Quick answers for Palawan resort owners',
    loading: 'Loading questions...',
    error: 'Failed to load questions',
    empty: 'No questions available',
    fallbackNotice: 'FAQs are currently displayed in English. Translations coming soon.',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Share Your Thoughts',
    subtitle: 'Help us improve the platform',
    nameLabel: 'Name (optional)',
    namePlaceholder: 'Your name',
    feedbackLabel: 'Your Feedback',
    messagePlaceholder: 'What would you like to see improved?',
    submitButton: 'Submit',
    submitting: 'Submitting...',
    successTitle: 'Thank you for your feedback!',
    errorTitle: 'Failed to submit',
    emptyValidation: 'Please enter your feedback',
    recentTitle: 'Recent Feedback',
    anonymous: 'Anonymous',
    noFeedback: 'No feedback yet. Be the first!',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Resort operations software for Palawan',
    products: 'Products',
    integration: 'Integration',
    legal: 'Legal',
    poweredBy: 'Powered by',
    terms: 'Terms',
    privacy: 'Privacy',
    security: 'Security',
    copyright: '© {year} Palawan Collective Inc.',
  },
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    noResults: 'No results found',
  },
};
