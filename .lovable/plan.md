

## Pass 1 of 3: Dark Design System + Hero & Header (Final)

Approved with 3 corrections incorporated.

### 1. `tailwind.config.ts`
Add to `theme.extend.colors`:
```ts
burgundy: {
  DEFAULT: "hsl(355 70% 55%)",
  foreground: "hsl(0 0% 100%)",
}
```
Opacity variants work automatically.

### 2. `src/index.css`
- Both `:root` and `.dark` resolve to dark palette:
  - `--background: 240 7% 4%`
  - `--card: 240 6% 8%`
  - `--popover: 240 5% 10%`
  - `--muted: 240 5% 10%`
  - `--muted-foreground: 240 5% 65%`
  - `--foreground: 0 0% 98%`
  - `--border: 240 5% 15%` (single value, **no** new utility classes — use `border-white/5` and `border-white/10` inline per correction #1)
- Body: add `overflow-x-hidden`.
- Add `.section-padding { @apply py-20 md:py-28 lg:py-32; }`.

### 3. `Header.tsx`
- `<header>`: `bg-[#0A0A0C]/80 backdrop-blur-md border-b border-white/5`, keep sticky.
- Logo: `h-8 md:h-9 w-auto`.
- Icons/links: `text-[#A1A1AA] hover:text-white transition-colors`.
- Preserve all existing elements/handlers.

### 4. `HeroSection.tsx`

**Remove:** floating logo block + four category pills.

**Preserve (correction #3):** `useSiteSettings` and `useTheme` imports stay even if unused.

**Structure:**
```tsx
<section className="relative bg-[#0A0A0C] min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
  {/* Glows: absolute against section, NOT inside grid (correction #2) */}
  <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] lg:w-[800px] lg:h-[800px] -translate-y-1/4 translate-x-1/4"
       style={{ background: "radial-gradient(circle, hsl(355 70% 55% / 0.12), transparent 60%)" }} />
  <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/3 -translate-x-1/3"
       style={{ background: "radial-gradient(circle, hsl(355 70% 55% / 0.05), transparent 70%)" }} />

  <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8 grid lg:grid-cols-5 gap-8 items-center">
    <div className="lg:col-span-3 space-y-6 text-left">
      {/* tag, headlines, subhead, CTAs, trust */}
    </div>
    <div className="hidden lg:block lg:col-span-2" aria-hidden />
  </div>
  {/* scroll chevron preserved */}
</section>
```

**Content blocks:**
1. Tag: `inline-flex w-fit px-4 py-1.5 rounded-full bg-burgundy/10 border border-burgundy/25 text-burgundy text-[11px] font-medium uppercase tracking-[0.15em]` → "Digital Agency · Palawan, Philippines".
2. Headline 1: `text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white` → "We build webapps".
3. Headline 2: `text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-burgundy` → "for Palawan businesses."
4. Subhead: `text-base md:text-lg text-[#A1A1AA] max-w-xl mt-6 leading-relaxed`.
5. CTAs `flex flex-col md:flex-row gap-3 mt-8`:
   - Primary WhatsApp: `bg-burgundy hover:bg-burgundy text-white rounded-full h-12 px-7 shadow-lg shadow-burgundy/30 hover:scale-[1.02] transition-transform w-full md:w-auto`.
   - Secondary "See live demos": `border border-white/15 bg-transparent text-white hover:bg-white/5 rounded-full h-12 px-7 w-full md:w-auto`.
6. Trust: `text-xs uppercase tracking-[0.15em] text-[#71717A] mt-8`.

**Scroll chevron:** preserved, color `text-[#71717A] hover:text-white`.

### Files Touched
- `tailwind.config.ts`
- `src/index.css`
- `src/components/landing/Header.tsx`
- `src/components/landing/HeroSection.tsx`

### Out of Scope
- All other landing sections (passes 2 & 3), admin, routing, data, dependencies, import cleanup.

