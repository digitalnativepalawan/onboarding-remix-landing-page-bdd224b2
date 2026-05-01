# Project Memory

## Core
- **App Structure**: All operational modules (Dashboard, Timesheet, etc.), onboarding flows, and landing page CTAs MUST redirect to `euro.palawancollective.com/admin`.
- **Integrations**: Cloudbeds is the exclusive booking engine. NEVER mention Sirvoy. Target: off-grid Palawan resorts.
- **Design System**: Dark theme. Syne (headings) + DM Sans (body). Never use Roboto/Inter/Arial. Accent #FF4D2E coral-red. Glassmorphism cards. 1100px max-width. Mobile-first.
- **Localization**: Supports EN (default), TL, IT, DE via key-value dictionary and header language switcher.
- **Admin**: Protected by passkey '5309'. English is the master language for Supabase FAQs; Gemini Flash auto-translates to others.

## Memories
- [Visual System](mem://style/visual-system) — Syne + DM Sans, coral-red accent, glassmorphism, 1100px max-width
- [Multi-language System](mem://features/i18n-l10n-system) — EN/TL/IT/DE dictionary implementation
- [Multilingual FAQs](mem://features/multilingual-faqs) — Supabase Edge Function Gemini auto-translation
- [Admin Controls](mem://features/admin-controls) — Passkey 5309, FAQ and header link mgmt
- [Header Layout](mem://style/header-layout) — Nav links + hamburger mobile menu + Talk to Us CTA
- [Footer Layout](mem://style/footer-layout) — 3-column: Products, Resources, Legal + accent top border
- [Navigation Utility](mem://style/navigation-utility) — Floating scroll to top/bottom buttons
- [Vision & Scope](mem://project/vision-and-scope) — Target audience and modules overview
- [Unified App Structure](mem://architecture/unified-app-structure) — Single domain hosting strategy
- [Branding Integration](mem://project/branding-integration) — Cloudbeds exclusivity constraints
- [Featured Apps Section](mem://features/featured-apps-section) — Admin-managed service links on landing page
- [Hero App Preview](mem://features/hero-app-preview) — Interactive rotating mockup component
- [Onboarding Flow](mem://features/onboarding-flow) — Centralized routing strategy for setups
