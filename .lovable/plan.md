

## Plan: Consolidate to Single App at account.palawancollective.com

### Context
You've merged all 5 separate apps (Dashboard, Timesheet, Inventory, Orders, OTR Scan) into one unified app at `account.palawancollective.com`. The current landing page and dashboard still reference the old multi-app setup with demo/live modes and individual app URLs.

---

### Changes Overview

#### 1. HeroSection -- Single CTA pointing to account.palawancollective.com

**File:** `src/components/landing/HeroSection.tsx`

- Remove the "Start with Demo Data" button entirely
- Change "Connect My Resort" to open `https://account.palawancollective.com` directly (no longer navigates to `/setup`)
- Keep the trust note and Cloudbeds note as-is

#### 2. OnboardingStrip -- Simplify steps

**File:** `src/components/landing/OnboardingStrip.tsx`

- Update Step 1 to reference exploring the landing page (not demo mode)
- Update Step 3 to say "Sign up at account.palawancollective.com" instead of referencing multiple apps

Update corresponding translations in all 4 language files.

#### 3. Dashboard -- Replace hardcoded quick-nav apps with single link

**File:** `src/pages/Dashboard.tsx`

- Remove the hardcoded `EXTERNAL_APP_URLS` map (5 old URLs)
- Remove the `quickApps` array with 5 separate app buttons
- Replace with a single "Open Backoffice" button pointing to `https://account.palawancollective.com`

#### 4. Dashboard Widgets -- Update empty-state URLs

**File:** `src/components/dashboard/DemoOccupancyWidget.tsx`
- Change "Connect Cloudbeds" and "Add Manual" buttons from `onboarding.heatmap.palawancollective.com` to `account.palawancollective.com`

**File:** `src/components/dashboard/DemoRevenueWidget.tsx`
- Change "Connect Booking Source" button URL to `account.palawancollective.com`

**File:** `src/components/dashboard/DemoExpensesWidget.tsx`
- Change "Add Expense" button URL to `account.palawancollective.com`

#### 5. Dashboard OnboardingChecklist -- Update setup link

**File:** `src/components/dashboard/OnboardingChecklist.tsx`
- Change "Go to Setup" button to open `account.palawancollective.com` instead of navigating to `/setup`

#### 6. Setup Page -- Simplify to single-app redirect

**File:** `src/pages/Setup.tsx`

The 3-step wizard (choose tools, choose mode, pick starting app) no longer makes sense with 1 unified app. Simplify to:
- A brief welcome/confirmation screen
- A single "Go to My Account" button that opens `account.palawancollective.com`
- Keep the back button to return to landing page

#### 7. Translation updates

**Files:** `en.ts`, `tl.ts`, `de.ts`, `it.ts`
- Update `hero.startDemo` key -- remove or repurpose
- Update `hero.connectResort` text if needed
- Update `onboardingStrip.step3` description to reference single app
- Add/update any new keys for the simplified setup page

---

### Summary of Files

| File | Change |
|------|--------|
| `src/components/landing/HeroSection.tsx` | Remove demo button, single CTA to account.palawancollective.com |
| `src/components/landing/OnboardingStrip.tsx` | Update step 3 text |
| `src/pages/Dashboard.tsx` | Remove 5-app quick nav, single "Open Backoffice" link |
| `src/components/dashboard/DemoOccupancyWidget.tsx` | Update URLs to account.palawancollective.com |
| `src/components/dashboard/DemoRevenueWidget.tsx` | Update URL |
| `src/components/dashboard/DemoExpensesWidget.tsx` | Update URL |
| `src/components/dashboard/OnboardingChecklist.tsx` | Point to account.palawancollective.com |
| `src/pages/Setup.tsx` | Simplify to single-app welcome page |
| `src/lib/i18n/translations/en.ts` | Update translations |
| `src/lib/i18n/translations/tl.ts` | Update translations |
| `src/lib/i18n/translations/de.ts` | Update translations |
| `src/lib/i18n/translations/it.ts` | Update translations |

### What stays the same
- Footer product links (still dynamic from `app_links` database -- you can clean those up via Admin Settings)
- ModuleGroupsSection (describes operational areas, still relevant)
- All other landing page sections (FAQ, Benefits, Features, etc.)
- The `/dashboard` route itself (still useful as a preview/demo page)

