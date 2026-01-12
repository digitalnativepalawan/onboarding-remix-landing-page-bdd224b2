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
    headline: 'One System.',
    headlineGradient: 'Every Module You Need.',
    subheadline: 'Sirvoy handles bookings. Palawan Collective handles the rest — staffing, inventory, food orders, and insights — in one connected system for resort operators.',
    badge1: 'Connected to Sirvoy for real-time booking data',
    badge2: "You don't need every module on day one",
    yourTools: 'Your Tools',
  },
  onboarding: {
    tag: 'Getting Started',
    title: 'First 7 Actions for New Resort Owners',
    subtitle: 'An optional guide to help you get started with the most common setup steps. Each action links to the relevant module.',
    footer: 'This checklist is informational only. Progress is not tracked and completion is optional.',
    items: {
      connectSirvoy: {
        title: 'Connect Sirvoy',
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
    tag: 'How It Works',
    title: 'Built for Independent Resorts',
    subtitle: 'A modular system that grows with your operation. Start with what you need, add more when ready.',
    features: {
      dataSync: {
        title: 'Real-Time Data Sync',
        description: 'Sirvoy bookings flow directly into your dashboard. No manual entry, no delays.',
      },
      modular: {
        title: 'Modular by Design',
        description: 'Enable only the tools you need. Timesheet, inventory, food ordering — each works independently.',
      },
      tracking: {
        title: 'Unified Tracking',
        description: 'See occupancy, staffing, and costs in one place. Make decisions with complete visibility.',
      },
    },
  },
  features: {
    tag: 'Tools',
    title: 'Everything You Need to Run Your Resort',
    subtitle: 'Each module is designed to work standalone or together. Start with one, expand as needed.',
    learnMore: 'Learn More',
    tools: {
      occupancy: {
        title: 'Occupancy Tracker',
        description: 'Real-time room availability synced with Sirvoy. Track daily rates and forecast demand.',
      },
      timesheet: {
        title: 'Timesheet & Payroll',
        description: 'Clock in/out, schedule shifts, and calculate payroll. Integrates with occupancy for labor cost analysis.',
      },
      inventory: {
        title: 'Inventory Management',
        description: 'Track stock levels, set reorder alerts, and manage suppliers. Reduce waste and stockouts.',
      },
      foodOrdering: {
        title: 'Food Ordering System',
        description: 'Guest-facing menu with order management. Track sales and integrate with inventory.',
      },
      otrScan: {
        title: 'OTR Scan',
        description: 'Scan and digitize Official Travel Receipts. Extract data automatically for expense tracking.',
      },
      developer: {
        title: 'Developer Tools',
        description: 'API access, webhooks, and custom integrations. Build on top of the platform.',
      },
    },
  },
  benefits: {
    tag: 'Why Choose Us',
    title: 'Built Different',
    subtitle: 'No hidden fees. No vendor lock-in. Just tools that work.',
    items: {
      noLockIn: {
        title: 'No Lock-In',
        description: 'Export your data anytime. Switch providers without losing history.',
      },
      modular: {
        title: 'Pay for What You Use',
        description: 'Enable modules as needed. No forced bundles or unused features.',
      },
      transparent: {
        title: 'Transparent Pricing',
        description: 'Clear, upfront costs. No surprise fees or hidden charges.',
      },
      ownership: {
        title: 'Data Ownership',
        description: 'Your data belongs to you. Full export capabilities included.',
      },
    },
  },
  bestPractices: {
    tag: 'Best Practices',
    title: 'Tips from Resort Operators',
    items: [
      'Start with occupancy tracking before adding other modules',
      'Train one staff member as the system admin',
      'Review reports weekly to spot trends early',
      'Use inventory alerts to prevent stockouts',
      'Schedule payroll reviews on the same day each period',
    ],
  },
  faq: {
    tag: 'FAQ',
    title: 'Common Questions',
    subtitle: 'Quick answers to help you get started.',
    loading: 'Loading questions...',
    error: 'Failed to load questions',
    empty: 'No questions available',
  },
  feedback: {
    tag: 'Feedback',
    title: 'Share Your Thoughts',
    subtitle: "We're always looking to improve. Let us know what you think.",
    namePlaceholder: 'Your name (optional)',
    messagePlaceholder: 'Your feedback...',
    submitButton: 'Send Feedback',
    submitting: 'Sending...',
    successTitle: 'Thank you!',
    successMessage: 'Your feedback has been submitted.',
    errorTitle: 'Error',
    errorMessage: 'Failed to submit feedback. Please try again.',
    recentTitle: 'Recent Feedback',
    anonymous: 'Anonymous',
    noFeedback: 'No feedback yet',
  },
  footer: {
    brand: 'Palawan Collective',
    tagline: 'Resort operations, simplified.',
    builtWith: 'Built with',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
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
