

## Plan: Premium Visual Polish for Landing Page (Approved + Adjustments)

Pure styling pass — no structural, content, routing, or business logic changes. Adjustments incorporated.

### 1. Global tokens (`src/index.css`)
- Dark `--background` → `240 6% 6%`; dark `--card` → `240 5% 9%`.
- Add `.bg-grain` utility (SVG noise, ~3% opacity).
- Strengthen `.section-tag` (uppercase, `tracking-[0.18em]`, `text-[10px]`) and `.section-title` (`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight`).

### 2. Hero (`HeroSection.tsx`)
- Headline → `text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]`.
- Subhead → `text-base md:text-lg text-muted-foreground`.
- WhatsApp CTA: `rounded-full h-12 px-7 shadow-lg shadow-[#25D366]/25 hover:scale-[1.02]`.
- "See our work" CTA: `rounded-full` outline, fills on hover.
- Tag chip: uppercase, tracked-wider.

### 3. Sticky mobile CTA bar — **in `src/pages/Index.tsx`** (page-level, per adjustment #1)
- Inline component inside `Index.tsx` (no new file). `useEffect` listens for scroll > 600px.
- Fixed bottom, `<md` only, backdrop-blur, two pill buttons (WhatsApp + See Work).

### 4. AgencyApps cards (`AgencyAppsSection.tsx`)
- Wrapper: `rounded-2xl border border-white/5 hover:-translate-y-1 hover:border-white/15 transition-all duration-300`.
- "LIVE SITE" pill: `group` + arrow `group-hover:translate-x-1`.
- Category tag: `text-[10px] uppercase tracking-wider`.

### 5. Benefits (`BenefitsSection.tsx`)
- Icons: `w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5`.
- Cards: `p-5 md:p-6 rounded-xl`, two-col on `md:`.
- Offline callout: highlighted card `border-primary/30 bg-primary/5 rounded-xl p-6` with Wifi badge.
- Section padding `py-20 md:py-32`.

### 6. Blog (`BlogSection.tsx`)
- Card padding `p-6 md:p-7 rounded-2xl`.
- Divider `border-t border-border/30 pt-3` between meta and bottom.
- Bottom arrow `group-hover:translate-x-1`.

### 7. FAQ (`FAQSection.tsx`) — **no edits to `accordion.tsx`** (per adjustment #2)
- Style only from within FAQSection: `AccordionTrigger` className → `py-5 text-base`.
- Open state: strengthen `data-[state=open]:bg-card/70`.
- Default Radix chevron animation kept as-is.

### 8. Feedback (`FeedbackSection.tsx`)
- Inputs/textarea: `rounded-xl border-border/40 focus:ring-2 focus:ring-primary/40 focus:border-primary/50`.
- Submit: `rounded-full h-11 shadow-lg shadow-primary/20`.

### 9. Footer (`Footer.tsx`)
- Padding `py-12 md:py-16`; social icons `hover:text-primary`.

### 10. Section spacing
- All major sections → `py-20 md:py-32`.

### Files Touched
- **Edited**: `src/index.css`, `src/pages/Index.tsx` (sticky CTA), `HeroSection.tsx`, `AgencyAppsSection.tsx`, `BenefitsSection.tsx`, `BlogSection.tsx`, `FAQSection.tsx`, `FeedbackSection.tsx`, `Footer.tsx`.
- **NOT touched**: `src/components/ui/accordion.tsx`, any admin files, routing, data layer.

### Out of Scope
- Admin pages, font swap, content/copy, section reordering, new dependencies.

