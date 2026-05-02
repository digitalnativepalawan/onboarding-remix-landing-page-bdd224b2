## Goal

Add a "Products" section to the existing admin panel for full CRUD + image management of the cards displayed on the landing page (`AgencyAppsSection`). The frontend visual design stays exactly the same — only the data source becomes the `products` table instead of the hardcoded `PRODUCTS` array.

## What already exists (no changes needed)

- `products` table with the right columns: `id, title, category, hostname, url, accent_color, description, images (jsonb), preview_type, legacy_component_key, sort_order, is_visible`. RLS is open for read + manage.
- 6 products already seeded (BackOffice, Palawan Transit, WildFall, Your Own Website, Order Online, Buy Land).
- Storage bucket `product-images` (public).
- Admin shell at `/admin` with `AdminLayout` + `AdminSidebar` + `PasskeyGate` (5309).
- Landing component `AgencyAppsSection.tsx` already fetches from `app_links` for visibility — we'll replace its hardcoded list with the DB.

## New files

1. **`src/pages/admin/ProductsPage.tsx`** — list view
   - Uses TanStack Query (key `["admin-products"]`) → `supabase.from("products").select("*").order("sort_order")`.
   - Page header: title + "New Product" button.
   - Drag-and-drop reorder using `@dnd-kit/core` + `@dnd-kit/sortable` (already in shadcn-friendly stack; will install if missing).
   - Each row card shows: cover image thumb (first image in `images[]`, or initials fallback with `accent_color`), title, category chip, hostname, URL (clickable), `is_visible` toggle, Edit button, Delete button.
   - On reorder: bulk update `sort_order` (multiples of 10) via one Promise.all of updates, then invalidate query.
   - Visibility toggle: optimistic `update({ is_visible }).eq("id", id)`.

2. **`src/components/admin/products/ProductFormModal.tsx`** — create/edit dialog
   - Fields: Title, Category (free-text input — current values are short labels like "Resort ops"), Description (textarea), URL, Hostname (auto-derived from URL on blur, editable), Accent color (color input + hex text), Visible (switch), Sort order (number, defaults to max+10).
   - Images section: see #3.
   - Save: insert or update row, invalidate `["admin-products"]`, toast.
   - Delete (only in edit mode): confirms, then deletes images from storage + row.

3. **`src/components/admin/products/ProductImagesManager.tsx`**
   - Reads `images` jsonb (array of `{ path: string, url: string }` objects).
   - **Upload**: file input (multi-select, accepts image/*). Each file → `supabase.storage.from("product-images").upload(\`${productId}/${crypto.randomUUID()}-${name}\`, file)`, then get `getPublicUrl`, append to local list. Save persists `images` jsonb on the product row.
   - **Delete**: remove from storage + local list.
   - **Replace**: delete old + upload new at same index.
   - **Reorder**: drag-and-drop using `@dnd-kit/sortable`; first image is the cover.
   - For new products (no id yet): require Save first to enable image uploads (use the inserted id), or store files temporarily and upload after first save. Simpler: on create, save row first, then enable image manager — show hint "Save the product to add images".

## Modified files

4. **`src/components/admin/AdminSidebar.tsx`**
   - Add `{ title: "Products", url: "/admin/products", icon: Package }` (use a different icon — `LayoutGrid` — since `Package` is already used for "Catalog"). Insert near top, after Dashboard.

5. **`src/components/admin/AdminLayout.tsx`**
   - Add `"/admin/products": "Products"` to `titleMap`.

6. **`src/App.tsx`**
   - Add route: `<Route path="products" element={<ProductsPage />} />` inside the `/admin` layout.

7. **`src/components/landing/AgencyAppsSection.tsx`** — make dynamic, keep design identical
   - Remove the hardcoded `PRODUCTS` array.
   - Keep all 6 preview components (`BackofficePreview`, `TransitPreview`, `WildfallPreview`, `SiteBuilderPreview`, `OrderPreview`, `LandPreview`) — these are the rich CSS mockups.
   - Build a `LEGACY_PREVIEWS` registry mapping `legacy_component_key` → component:
     ```ts
     const LEGACY_PREVIEWS = { backoffice: BackofficePreview, transit: TransitPreview, wildfall: WildfallPreview, site_builder: SiteBuilderPreview, order: OrderPreview, land: LandPreview };
     ```
   - Fetch from `products` where `is_visible = true` ordered by `sort_order`.
   - Render logic per product:
     - If `preview_type === "legacy_css"` and a matching `legacy_component_key` exists → render that component.
     - Else if `images` array has at least one entry → render an `<img>` of `images[0].url` (object-cover, fills preview zone).
     - Else → render initials placeholder using `accent_color`.
   - Remove the now-unused `app_links` fetch (visibility now lives on the `products` row).
   - "View Product" link uses `product.url` directly — already the pattern.

## Database

No migration needed. The `products` table and the `product-images` storage bucket already exist. We'll need one small data update to set `legacy_component_key` for the 6 existing rows so the rich previews keep showing:
- `backoffice` → BackOffice Resort
- `transit` → Palawan Transit
- `wildfall` → WildFall Soft Air
- `site_builder` → Your Own Website
- `order` → Order Online WebApp
- `land` → Buy Land in Palawan

This will be done via a one-shot insert/update SQL after building the page.

## Dependencies

- `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop reordering (products list + image gallery). Will `bun add` if not already present.

## Behavior summary for the user

- New "Products" item appears in the admin sidebar.
- Click it → list of all products with cover thumbs, visibility toggle, drag handle.
- Click a product → modal with title, description, URL, accent color, visibility, and an image gallery (upload, delete, reorder, replace).
- Add new products with the "New Product" button. Newly created products without a `legacy_component_key` will display their first uploaded image as the preview on the landing page.
- The 5 existing legacy products keep their hand-coded mockups untouched — you only edit text/URL/visibility/order on those, unless you upload images and switch their preview type to "screenshots" later.
- "View Product" button on the landing page links to the URL stored in the DB — change it in admin and it's live immediately on the site.
