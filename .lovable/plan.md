

## Pass 3 Final: Blog, FAQ, Feedback, Footer (with 4 corrections)

### Pre-flight reads
- `HeroSection.tsx` → identify WhatsApp href source of truth (useSiteSettings vs constant). FAQ ghost CTA reuses identical source.
- `Footer.tsx` mobile (`sm:hidden`) and desktop (`hidden sm:grid`) blocks → diff for unique content before unifying.

### 1. `BlogSection.tsx`
- Section `py-20 md:py-28 lg:py-32`, container `max-w-6xl mx-auto px-6 md:px-8`.
- Centered header: burgundy eyebrow "FROM THE BLOG", white heading, muted subhead (preserve copy).
- Card wrapper: `group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 hover:-translate-y-1 transition-all duration-300`.
- **New image zone** (`aspect-[16/9] rounded-t-2xl relative overflow-hidden`):
  - Gradient `bg-gradient-to-br from-{accent}/30 via-{accent}/10 to-transparent` mapped by `post.tag` → burgundy/amber/sky/orange + Briefcase/Building2/Bus/UtensilsCrossed icon at 12% opacity (`w-24 h-24` centered).
  - Dot pattern overlay (radial-gradient 1px dots, 16px grid, rgba 0.08).
- Content `p-6`: category pill, title `text-lg md:text-xl font-semibold text-white mt-4 group-hover:text-burgundy`, description `line-clamp-2`, bottom row with date + ArrowRight (`group-hover:translate-x-1`).
- Grid `grid-cols-1 md:grid-cols-2 gap-6`. Modal preserved.

### 2. `FAQSection.tsx` (structural two-column)
- **Correction #1**: Read HeroSection first; reuse same WhatsApp href source (likely `useSiteSettings().settings.contact_whatsapp` based on Footer pattern, but confirm).
- **Correction #2**: `fallbackNotice` stays in its exact current DOM position (above accordion).
- **Correction #4**: `border-t border-white/5` on the Accordion wrapper element, NOT on first item.
- Section `py-20 md:py-28 lg:py-32`, container `max-w-6xl mx-auto px-6 md:px-8`.
- Outer `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12`.
- Left `lg:col-span-5 lg:sticky lg:top-24 lg:self-start`: burgundy eyebrow, white heading, muted subhead `max-w-sm`, ghost CTA "Still have questions? →" (burgundy, `inline-flex items-center gap-1.5 hover:gap-2`) using same WhatsApp href as Hero.
- Right `lg:col-span-7`:
  - `fallbackNotice` (preserved in current position, retokened to muted).
  - Accordion wrapper: `border-t border-white/5` (no `space-y-3`, no card bg).
  - Each `AccordionItem`: `border-b border-white/5` only — remove existing `rounded-xl px-5 bg-card/30` styling.
  - `AccordionTrigger`: `py-5 text-base md:text-lg font-medium text-white hover:text-burgundy transition-colors`.
  - `AccordionContent`: `pb-5 pt-0 text-sm md:text-base text-[#A1A1AA] leading-relaxed max-w-prose`.
- Shared `accordion.tsx` primitive untouched.

### 3. `FeedbackSection.tsx`
- Section `py-20 md:py-28 lg:py-32` (drop `bg-muted/20`), container `max-w-3xl mx-auto px-6 md:px-8`.
- Centered header: burgundy eyebrow, white heading, muted subhead (preserve copy).
- Form card: `bg-card border border-white/5 rounded-2xl p-6 md:p-8 mt-10`.
- Labels `text-sm font-medium text-white mb-2 block`.
- Inputs/Textarea: `bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-white placeholder:text-[#71717A] focus:ring-2 focus:ring-burgundy/40 focus:border-burgundy/50 transition-all`. Textarea `min-h-[120px] resize-y`.
- Submit: `w-full bg-burgundy hover:bg-burgundy/90 text-white rounded-full h-11 shadow-lg shadow-burgundy/25 hover:scale-[1.02]`. Send icon + spinner state preserved.
- Recent list `mt-10`: label `text-sm font-medium text-white mb-4`. Items: `bg-card/50 border border-white/5 rounded-xl p-4`, top row name+date, body `text-sm text-[#A1A1AA] mt-2`. `space-y-3`.
- All data fetching, realtime, submission logic preserved.

### 4. `Footer.tsx`
- **Correction #3**: Audit both `sm:hidden` and `hidden sm:grid` blocks. From current view both render identical content (BrandBlock + Integration column + Legal column) — confirm during implementation and merge any unique pieces (e.g., mobile-specific `grid-cols-2` arrangement vs desktop `grid-cols-3`). All BrandBlock, channels list, legalLinks, ContactBlock content carried into unified layout.
- `<footer>`: `bg-[#080809] border-t border-white/5 py-12 md:py-16`.
- Container `max-w-6xl mx-auto px-6 md:px-8`.
- Single `grid grid-cols-1 md:grid-cols-3 gap-8`:
  - **Brand**: company name `text-sm font-semibold text-white`, tagline `text-xs text-[#71717A] mt-1`, address `text-sm text-[#A1A1AA] mt-4`, ContactBlock retokened (`text-sm text-[#A1A1AA] hover:text-burgundy`), socials `w-5 h-5 text-[#A1A1AA] hover:text-burgundy`.
  - **Integration**: heading `text-sm font-semibold text-white mb-4`, "Powered by Cloudbeds" `text-xs text-[#71717A]` with burgundy link, channels `text-sm text-[#A1A1AA] space-y-2`.
  - **Legal**: heading + buttons `text-sm text-[#A1A1AA] hover:text-burgundy text-left space-y-2`.
- Copyright: `border-t border-white/5 pt-6 mt-10 text-xs text-[#71717A] text-center` (text preserved). LegalModal mount preserved.

### Files Touched
- `src/components/landing/BlogSection.tsx`
- `src/components/landing/FAQSection.tsx`
- `src/components/landing/FeedbackSection.tsx`
- `src/components/landing/Footer.tsx`

### Out of Scope
- Passes 1 & 2 sections, admin, `accordion.tsx` primitive, routing, data, hrefs, copy, dependencies, import cleanup.

