## Goal

Add a dedicated product showcase section for the **BackOffice Resort WebApp** to the landing page, using the 7 BAIA screenshots you uploaded. 5 alternating story cards + bottom CTA strip. Dark theme, gold accent, Poppins font, mobile-first, no horizontal scroll.

---

## 1. Assets

Copy 5 uploaded screenshots into `src/assets/backoffice/`:

| File | Used in |
|---|---|
| `baia-login.png` (from `BAIA-05-04-2026_09_25_AM.png`) | Card 1 — The System |
| `baia-guest-portal.png` (from `BAIA-05-04-2026_09_25_AM_1.png`) | Card 2 — Guest Experience |
| `baia-kitchen.png` (from `BAIA-05-04-2026_09_28_AM_1.png`) | Card 3 — Kitchen Flow |
| `baia-reception.png` (from `BAIA-05-04-2026_09_27_AM.png`) | Card 4 — Operations Command |
| `baia-bill.png` (from `BAIA-05-04-2026_09_26_AM.png`) | Card 5 — Billing Close |

Imported as ES6 modules. Other 2 uploads (Service Mode, Menu) unused for now.

## 2. Font: Poppins (scoped)

Your site uses Syne + DM Sans globally and a memory rule says no other fonts. To honor your explicit Poppins request without breaking the rest of the site:

- Add Poppins (300/500/600/700) to the existing Google Fonts `<link>` in `index.html`.
- Add a Tailwind font family `font-poppins` in `tailwind.config.ts`.
- Apply `font-poppins` **only inside the new section** — rest of site untouched.

I will note this exception in `mem/style/visual-system` so future work knows the rule has a scoped exception for this showcase section.

## 3. New component: `src/components/landing/BackofficeShowcaseSection.tsx`

Single self-contained section. Structure:

```text
<section id="backoffice-showcase" font-poppins, bg #08080F>
  page-container max-w 1200px, px-6
  ├── Header
  │     eyebrow "RESORT OPERATING SYSTEM"
  │     H2 "One system." / "Every department." (bold white)
  │     gold italic accent line "Zero chaos."
  │     subtext muted
  │     gold 1px hr, w-20, mx-auto
  ├── Cards: space-y-12 md:space-y-20
  │     Card 1 — text left  | screenshot right  (md:grid-cols-2)
  │     Card 2 — screenshot left | text right
  │     Card 3 — text left  | screenshot right
  │     Card 4 — screenshot left | text right
  │     Card 5 — text left  | screenshot right
  │     (mobile: always single column, text first then screenshot)
  └── Bottom CTA strip (bg #0D0D18, rounded-2xl, mt-20)
        H3 + subtext + 2 buttons (gold solid + outline WhatsApp)
```

### Card markup

- Outer: `bg-[#12121F] border border-[#C8A96E]/20 rounded-2xl p-7 md:p-12`
- Text block:
  - eyebrow: `text-[11px] tracking-[0.2em] uppercase text-[#C8A96E] font-medium`
  - H3: `text-2xl md:text-3xl font-bold text-[#F5F3EE]`
  - body: `text-[#9A9690] font-light leading-relaxed`
  - bullets: gold dot `•` + `text-[#F5F3EE] font-medium text-sm`
- Screenshot "browser mockup":
  - wrapper: `rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5` with a faux titlebar (3 dots) on top
  - image: `w-full h-auto object-contain`
  - subtle gold glow: absolute blurred div behind, `bg-[#C8A96E]/10 blur-3xl`

### Card content (text per spec)

(Card 1 — THE PLATFORM / Card 2 — GUEST PORTAL / Card 3 — KITCHEN BOARD / Card 4 — RECEPTION DASHBOARD / Card 5 — GUEST BILLING — copy verbatim from your brief.)

### Bottom CTA strip

- H3 "Ready to run your resort smarter?"
- Sub "Used live at BAIA Boutique, San Vicente — Palawan"
- Buttons:
  - Primary gold: "See Live Demo →" → links to `https://www.baia.com` (or your live demo URL — confirm if different; default to `#` placeholder if you'd rather set later)
  - Outline: "Talk to Us on WhatsApp" → keeps existing `https://wa.me/639474443597` (per your no-change-WhatsApp rule)

### Animation

Reuse the existing `fade-up-hidden` / `fade-up-visible` IntersectionObserver pattern already used in `BlogSection.tsx`. 0.4s ease, 100ms stagger per card.

### Responsive / overflow safety

- `grid grid-cols-1 md:grid-cols-2 gap-8 items-center`
- All images `max-w-full h-auto`
- Section uses `overflow-hidden` to guarantee no horizontal scroll
- Tested mentally at 320px: single column, padding 28px, image scales down → no overflow.
- All buttons `min-h-[44px]`.

## 4. Wire into the page

In `src/pages/Index.tsx`, insert `<BackofficeShowcaseSection />` between `<AgencyAppsSection />` and `<BenefitsSection />` so the flagship product gets prime placement right after the apps grid.

## 5. Constraints respected

- WhatsApp link unchanged (`wa.me/639474443597`).
- No Supabase changes, no DB migration, no edits to feedback table.
- No horizontal overflow at 320/375/768/1200px.
- Existing components, fonts, colors elsewhere unchanged.
- 44px min touch targets on CTAs.

---

## Files touched

- **Create**: `src/components/landing/BackofficeShowcaseSection.tsx`
- **Create** (copy): `src/assets/backoffice/baia-login.png`, `baia-guest-portal.png`, `baia-kitchen.png`, `baia-reception.png`, `baia-bill.png`
- **Modify**: `src/pages/Index.tsx` (1 import + 1 line)
- **Modify**: `index.html` (add Poppins to existing Google Fonts link)
- **Modify**: `tailwind.config.ts` (add `poppins` to fontFamily)
- **Modify**: `mem/style/visual-system` (note Poppins scoped exception for backoffice showcase)

No other components, no DB, no edge functions, no auth changes.

## Open question (optional)

The "See Live Demo →" button — should it link to `baia.com`, the existing BackOffice product URL already in your `products` table, or a placeholder `#`? Default plan: link to whatever URL the existing "BackOffice Resort WebApp" product row in `products` already has (I'll read it at build time). Tell me if you want a different URL.
