

## Plan: Full-Page Project Workspace

Transform project detail from modal → dedicated full-page workspace at `/admin/projects/:id`, mobile-first, no horizontal scrolling, with rich tabbed sections.

### Routing & Navigation
- Add route `/admin/projects/:id` in `src/App.tsx` rendering new `ProjectWorkspacePage`.
- Update `ProjectsPage.tsx`: kanban/list cards navigate to workspace instead of opening `ProjectDetailModal` (keep modal removed for project view; edit modal kept for quick edits).
- Add "Back to Projects" breadcrumb in workspace header.

### Database (1 migration)
New tables (all with permissive RLS to match existing pattern):
- `project_links` — id, project_id, label, url, category (dev/design/api/docs/other), display_order, created_at
- `project_comments` — id, project_id, content, author (default 'admin'), resolved (bool), created_at, updated_at
- `project_files` — id, project_id, file_path, file_url, file_name, file_size, mime_type, created_at
- Reuse existing `notes` table for rich notes (already linked to project_id; add `pinned` boolean column)
- Reuse existing `media` table for image gallery (already has project_id)
- Reuse existing `activity_log` for timeline
- Storage bucket `project-files` (private, authenticated read/write/delete policies)

### New Files
```
src/pages/admin/ProjectWorkspacePage.tsx     ← main shell
src/components/admin/projects/workspace/
  ├─ WorkspaceHeader.tsx        title edit, status dropdown, save/duplicate/delete
  ├─ NotesTab.tsx               rich text (Tiptap), pin, autosave, word count
  ├─ LinksTab.tsx               grouped by category, dnd reorder, edit/delete
  ├─ GalleryTab.tsx             drag-drop upload to `media` bucket, lightbox, lazy load
  ├─ CommentsTab.tsx            list + add, resolve toggle, edit/delete
  ├─ TimelineTab.tsx            activity_log filtered by entity_id, type filter
  └─ FilesTab.tsx               drag-drop any file → project-files bucket, download/delete
```

### Layout (mobile-first, no horizontal scroll)
```text
┌─ AdminLayout (sidebar persists) ──────────────────┐
│  ← Back  | [Title editable]      [Status ▾] [⋯]  │
│  ─────────────────────────────────────────────    │
│  Mobile: <Select> tab switcher  (no scroll bar)   │
│  ≥md:   <Tabs> horizontal,  flex-wrap            │
│  ─────────────────────────────────────────────    │
│  <TabContent>  full width, max-w-5xl mx-auto      │
└───────────────────────────────────────────────────┘
```
- Mobile (<768): tab switcher = `<Select>` dropdown, content stacks single column, all cards `w-full`.
- Tablet (768-1024): 2-col where appropriate (links grid, gallery grid 2 cols).
- Desktop (≥1024): tabs as pills, gallery 3-4 cols, comments + activity side-by-side optional.
- All tables → card layouts; never `overflow-x-auto`.

### Rich Text Editor
- Use Tiptap (`@tiptap/react`, `@tiptap/starter-kit`) — bold, italic, lists, code blocks, headings.
- Debounced autosave (1s) to `notes.content`; word/char count below editor.
- "Pin" toggle sorts pinned notes to top.

### Activity Logging
Reuse existing `log_activity()` trigger pattern; attach triggers on new tables (`project_links`, `project_comments`, `project_files`) and on `media`/`notes` inserts so timeline auto-populates.

### Theme & Performance
- All colors via existing CSS tokens (`bg-card`, `text-foreground`, `border-border`) → light/dark automatic.
- Images: `loading="lazy"`, thumbnail grid → click opens `Dialog` lightbox.
- Tiptap editor isolated in tab → only mounts when Notes tab active.
- Tab content lazy via conditional render.

### Files Touched
- **New**: 1 migration, 7 components, 1 page
- **Edited**: `src/App.tsx` (route), `src/pages/admin/ProjectsPage.tsx` (navigate instead of modal), `src/components/admin/AdminLayout.tsx` (titleMap entry for dynamic project title)

### Out of Scope (this pass)
- Real-time multi-user comments (single admin assumed)
- File preview for non-image types (download only)
- Granular activity filters beyond entity_type

