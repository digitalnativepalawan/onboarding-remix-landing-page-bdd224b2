
Confirmed plan. Building in phases, you review each before next.

## Phase 0 — Database + Seed Data (this drop)

### New tables

**`projects`** — supersedes `admin_projects` for new work
- id, name, description, category, stage (idea|research|development|testing|live|monetized), github_url, lovable_url, vercel_url, live_url, tech_stack (text[]), team_members (text[]), start_date, target_launch, actual_launch, budget_php, actual_cost_php, screenshots (text[]), notes, display_order, created_at, updated_at

**`clients`** — supersedes `admin_clients`
- id, business_name, contact_name, whatsapp, email, location, facebook_url, business_type, source (referral|facebook|google|walk-in), pipeline_stage (prospect|contacted|demo|negotiating|closed|active), service_interests (text[]), estimated_value_php, monthly_recurring_php, last_contact_date, **follow_up_date**, **pitch_sent_date**, notes, created_at, updated_at

**`client_notes`** — timeline notes per client
- id, client_id (fk), content, created_at

**`catalog_items`** — supersedes `admin_catalog`
- id, name, description, category, base_price_php, features (text[]), tech_stack (text[]), setup_days, demo_url, screenshots (text[]), is_active, display_order, created_at

**`quotes`**
- id, client_id (fk), title, status (draft|sent|negotiated|accepted|rejected|expired), notes, terms, total_php, valid_until, **sent_via** (email|whatsapp|in-person), **follow_up_count** int default 0, last_reminder_at, created_at, updated_at

**`quote_items`**
- id, quote_id (fk), catalog_item_id (fk nullable), name, description, qty, unit_price_php, line_total_php, sort_order

**`tools`** — 13 GitHub tools
- id, name, github_url, description, license, installed bool, installed_at, token_burn (low|medium|high|negative), monthly_cost_usd, revenue_potential_php, priority_rank, use_cases (text[]), install_instructions, notes, created_at

**`notes`** — global notes
- id, title, content (rich text/HTML), type (idea|todo|meeting|client|bug|feature), priority (low|medium|high|urgent), due_date, completed bool, project_id (fk nullable), client_id (fk nullable), tool_id (fk nullable), tags (text[]), created_at, updated_at

**`media`**
- id, file_url, file_path, alt_text, media_type (screenshot|mockup|diagram|logo|photo), device_type (desktop|mobile|tablet|all), project_id (fk nullable), tool_id (fk nullable), tags (text[]), size_bytes, created_at

**`revenue`**
- id, client_id (fk), amount_php, type (setup|monthly|commission), payment_date, status (pending|paid|overdue), notes, created_at

**`weekly_goals`**
- id, title, target_value int, current_value int default 0, completed bool, week_start_date, sort_order, created_at, updated_at

**`activity_log`** — populated by triggers
- id, entity_type, entity_id, action (created|updated|deleted|status_changed), summary, created_at

### Triggers
- `updated_at` trigger on all mutable tables
- INSERT/UPDATE triggers on `projects`, `clients`, `quotes`, `revenue`, `notes` → write to `activity_log`

### Storage buckets
- `media` (public) — for /media uploads
- `screenshots` (public) — for project/catalog screenshots

### RLS
- Open policies on every new table (matches existing pattern, passkey-gated client-side, your decision)

### Seed data (12 clients across 4 locations)
- **San Vicente**: Long Beach Resort, Sunset Bay, Palm Cove
- **Port Barton**: Coconut Garden, Blue Lagoon, Mango Beach
- **Puerto Princesa**: Sheridan Beach, Hue Hotel, Princesa Garden
- **El Nido**: Lio Beach, Cauayan Island, Matinloc Resort
- 6 sample projects (matching current showcase)
- 13 GitHub tools pre-populated
- 5 catalog items, 10 notes, 3 quotes, 5 revenue records, 5 weekly goals

### What does NOT change in Phase 0
- No code changes. Migrations + seed inserts only.
- Existing `admin_*` tables, `app_links`, `site_settings`, FAQs, etc. left alone (you can clean up later).
- `/admin` page unchanged until Phase 1.

### Files in Phase 0
- 1 migration (schema + triggers + storage buckets + RLS)
- 1 seed insert batch (data only, via insert tool)

You'll review the database in the Backend view, then I start Phase 1 (sidebar shell + passkey gate over the new layout). Phase 2 dashboard includes the **Today's Actions** widget you requested (follow-ups due today + draft quotes >7 days old + meeting-type notes scheduled).
