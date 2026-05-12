## Goal
Turn this app into a pure command center. The landing page (hero, sections, footer, sticky CTA) goes away. Opening `/` takes you straight into the admin command center.

## Changes

**Routing (`src/App.tsx`)**
- Make `/` render `AdminLayout` with the dashboard as its index route (same nested admin routes as today).
- Keep `/admin/*` working as an alias so existing links/bookmarks don't break.
- Remove imports/usage of `Index`, `Setup`, `Dashboard`, `AdminPage`.

**Delete (no longer used)**
- `src/pages/Index.tsx`
- `src/pages/Setup.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/AdminPage.tsx`
- All landing components in `src/components/landing/` (Header, HeroSection, AgencyAppsSection, BackofficeShowcaseSection, BlogSection, BenefitsSection, FAQSection, FeedbackSection, Footer, ScrollFloaters, and the rest of the landing/* files).
- Demo dashboard widgets in `src/components/dashboard/` (only used by the deleted Dashboard page).

**Admin tweaks (`src/components/admin/AdminLayout.tsx`)**
- Remove the "Main site" link and the home-logo link back to `/` (there is no main site anymore). Keep the logo as a non-link brand mark.

**Kept as-is**
- Passkey gate (`5309`), sidebar, all admin pages (Products, Resort OS, Projects, Clients, Catalog, Quotes, Tools, Notes, Media, Revenue, Expenses, Site Settings, Feedback), Supabase data, theme + locale providers.

## Result
- `/` → passkey prompt → admin dashboard.
- `/admin/...` paths still work.
- No public marketing site, no hero, no footer — just your command center.

## Confirm before I build
- OK to permanently delete the landing components and demo dashboard widgets listed above? (They're not referenced anywhere else once `Index`/`Dashboard` are gone.)
