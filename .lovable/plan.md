## Goal

Each blog post (in admin + on the public site) needs:
1. An editable **"Visit site"** URL — renders as a prominent CTA button in the post detail modal.
2. A **multi-image gallery** — uploaded in admin, displayed as a swipeable carousel in the post modal so visitors can see all webapp screenshots.

The existing single `image_url` (cover) stays as the card thumbnail.

---

## 1. Database migration

Add two columns to `blog_posts`:

- `cta_url text` — optional link to the live webapp.
- `images jsonb default '[]'::jsonb` — array of `{ path, url }` objects (same shape used by `ProductImagesManager`).

No RLS change needed (existing policies cover all columns).

---

## 2. Admin — `src/components/landing/AdminSettingsModal.tsx`

Extend the blog form:

- **Site URL field** (Input, type=url) under the Title field, labeled "Live site URL (optional)" with helper text "Shown as a button on the post."
- **Gallery section** below the cover image, labeled "Additional screenshots (carousel)". Reuse `ProductImagesManager` pattern but uploads go to the existing `media` bucket under `blog/{postId}/...`. Supports multi-upload, drag-reorder, delete.
  - Gallery is only enabled while editing an existing post (needs an id for the storage folder); for new posts, show a hint "Save the post first, then add gallery images."
- Update `BlogPost` type, `emptyBlog`, `handleStartEditBlog`, and `handleSaveBlog` payload to include `cta_url` and `images`.

## 3. Public site — `src/components/landing/BlogSection.tsx`

Update the `BlogPost` interface with `cta_url: string | null` and `images: {path:string;url:string}[] | null`.

In the post detail modal:
- Replace the single hero image with a **carousel** when `images` has entries (fallback to `image_url`, then nothing). Use existing shadcn `@/components/ui/carousel` (embla). Show dots + prev/next arrows; swipe on mobile. Aspect 16/9, lazy-loaded.
- Above the WhatsApp button, add a primary **"Visit live site →"** button (opens `cta_url` in new tab) when `cta_url` is set. Keep WhatsApp button as secondary.

No card layout changes; the cover thumbnail stays as-is.

## 4. Constraints respected

- WhatsApp link untouched.
- Feedback table not touched.
- No horizontal overflow: carousel is contained, images use `object-cover`.
- 44px min touch targets on all new buttons.
- Reuses existing `media` bucket — no new storage bucket.

---

## Files touched

- **Migration**: add `cta_url`, `images` to `blog_posts`.
- **Modify**: `src/components/landing/AdminSettingsModal.tsx`
- **Modify**: `src/components/landing/BlogSection.tsx`

That's it. No other components affected.