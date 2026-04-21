

# Work Station + Billable Work Logging + Professional Invoice

Two related upgrades wrapped into one workflow:

1. **Rename "Notes" tab → "Work Station"** inside each project workspace, and add a "Log billable work" action that pushes line items straight to the client's quote/invoice.
2. **Redesign the Quote/Invoice PDF** so it actually looks like a professional invoice (the current PDF has an empty items table and wasted whitespace).

---

## Part 1 — Work Station (project workspace)

**Tab rename**
- In `ProjectWorkspacePage.tsx`, change the `notes` tab label to **"Work Station"**. Keep the `notes` route value so existing data/queries are untouched.
- Mobile select + desktop tab list both show "Work Station".

**New "Log Work" button (top of Work Station + Timeline tabs)**
- Opens a small modal: **Description**, **Hours** (optional), **Unit price (PHP)**, **Quantity** (defaults to 1 or hours), **Date** (defaults to today), and **Push to** dropdown listing the project's open quotes/invoices for the linked client (plus "Create new draft quote").
- On save:
  - Inserts a row into a new `work_logs` table (timestamped log of work done).
  - Inserts a matching row into `quote_items` for the chosen quote (or creates a new draft quote first if "Create new draft" is selected).
  - Recalculates and updates `quotes.total_php`.
  - Writes an entry to `activity_log` so it shows in the Timeline tab.
- Toast confirms: "Logged · Pushed to invoice INV-2026-000X".

**Where the button appears**
- Header of the Work Station tab (next to "New note").
- Header of the Timeline tab (so logging from a daily activity scroll is one tap).
- Optional inline button on each existing note card ("Bill this note" — pre-fills description from the note title).

---

## Part 2 — Database

New table `work_logs`:
- `id`, `project_id` (FK projects), `client_id` (FK clients, nullable — auto-derived from project's linked client), `quote_id` (FK quotes, nullable — set once pushed), `quote_item_id` (FK quote_items, nullable), `description`, `hours` (numeric, nullable), `qty` (numeric, default 1), `unit_price_php` (numeric), `line_total_php` (numeric, generated), `logged_on` (date, default today), `created_at`.
- RLS open policy (matches existing project pattern).

Projects table needs a `client_id` link so the modal can default the client. We'll add `client_id uuid references clients(id)` to `projects` (nullable). The modal will let the user pick/confirm the client if the project doesn't have one yet.

---

## Part 3 — Professional Invoice PDF (`pdf.ts` rewrite)

The screenshot shows: empty item table, "PHP 0" totals, address block stacked too tightly, logo isolated. Redesign:

```text
┌────────────────────────────────────────────────────────────┐
│  [LOGO]                                          INVOICE   │
│  merQato Digitals                                #INV-...  │
│  Smart Solutions for Bold Ambitions          Issued: ...   │
│                                              Due:    ...   │
├────────────────────────────────────────────────────────────┤
│  FROM                          BILL TO                     │
│  merQato Digitals              Blue Lagoon                 │
│  123 Sunset Beach Rd           [client address if stored]  │
│  San Vicente, Palawan 5309                                 │
│  info@merqato.digitals                                     │
│  +63 947 444 3597                                          │
├────────────────────────────────────────────────────────────┤
│  PROJECT: Blue Lagoon — Full Stack Package                 │
├────────────────────────────────────────────────────────────┤
│  # │ Description           │ Date    │ Qty │ Unit │ Total  │
│  1 │ API integration work  │ Apr 12  │ 2.0 │ 1500 │  3,000 │
│  2 │ ...                                                   │
├────────────────────────────────────────────────────────────┤
│                                       Subtotal:    XX,XXX  │
│                                       Discount:   -X,XXX  │
│                                       Tax (12%):   X,XXX  │
│                                       ───────────────────  │
│                                       TOTAL:    PHP XX,XXX │
├────────────────────────────────────────────────────────────┤
│  PAYMENT OPTIONS              │  [QR code]                 │
│  • Cash                       │  Scan to pay GCash         │
│  • GCash · 0917-...                                        │
│  • BPI · merQato · 1234-...                                │
├────────────────────────────────────────────────────────────┤
│  Notes / Terms                                             │
│                                                            │
│  Thank you for your business — merQato Digitals · 2026     │
└────────────────────────────────────────────────────────────┘
```

**Concrete PDF changes (`src/components/admin/quotes/pdf.ts`)**
- Top band with brand color underline (uses site settings primary color when available).
- Right-aligned title block: "INVOICE" / "QUOTE" + invoice #, issue date, due date, valid-until.
- Two-column **FROM / BILL TO** with proper spacing (current layout overlaps the meta box).
- Project line as its own banded row.
- Items table: numbered rows, alternating row shading, right-aligned numerics, money formatted with thousands separators and 2-decimal currency. If a line came from `work_logs`, show the `logged_on` date in a small grey sub-line under the description.
- Empty-state guard: if no items, render a friendly "No line items yet" row instead of a blank table.
- Totals block: clearer hierarchy, bold `TOTAL` row with brand-colored bar, currency code on its own.
- Payment block in a bordered card; QR rendered larger (45mm) with caption.
- Footer: thin divider + brand line + page number.
- Filename: `invoice-{number}-{client-slug}.pdf` for invoices, `quote-{client-slug}-{title-slug}.pdf` for quotes.

---

## Part 4 — Mobile

- Log Work modal uses the same full-screen sheet pattern as other admin modals on mobile.
- Work Station header buttons stack (`flex-col sm:flex-row`) so they don't clip on small screens.

---

## Files touched

- `src/pages/admin/ProjectWorkspacePage.tsx` — rename tab label.
- `src/components/admin/projects/workspace/NotesTab.tsx` — add "Log billable work" button + per-note bill action.
- `src/components/admin/projects/workspace/TimelineTab.tsx` — add "Log billable work" button.
- **New** `src/components/admin/projects/workspace/LogWorkModal.tsx` — the form + push-to-quote logic.
- `src/components/admin/quotes/pdf.ts` — full PDF redesign.
- New migration: `work_logs` table + `projects.client_id` column.
- Update `src/integrations/supabase/types.ts` regenerates automatically.

---

## Open question

Right now a project is linked to a client only implicitly. When you click "Log work", should we:
- **A)** Require the project to have a `client_id` first (one-time pick), then auto-route every log to that client's quotes; or
- **B)** Ask each time which client + which quote to push to (more flexible, more taps).

Default plan above uses **A** with a one-time client picker on first use. Tell me if you'd rather have B.

