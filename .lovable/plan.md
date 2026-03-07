

## Plan: Auto-Translate FAQs to All Languages on Add

### What Changes

When an admin adds a new FAQ in any language, the system will automatically translate it into the other 3 languages and insert all 4 versions into the database at once.

### How It Works

1. **New Edge Function: `translate-faq`**
   - Receives: `question`, `answer`, `source_language`
   - Uses Lovable AI (Gemini Flash) to translate the Q&A into the 3 other languages
   - Returns translated versions for all target languages

2. **Update `handleAddFaq` in `AdminSettingsModal.tsx`**
   - After the admin clicks "Add", call the `translate-faq` edge function
   - Insert the original FAQ + 3 translated versions (all with the same `display_order`)
   - Show a toast like "FAQ added and translated to all languages"
   - If translation fails, still insert the original and notify the admin

3. **Optional: Auto-translate on Edit**
   - When editing an existing FAQ, offer a "Re-translate" button that updates the other language versions

### Files

| File | Change |
|------|--------|
| `supabase/functions/translate-faq/index.ts` | New edge function using Lovable AI for translation |
| `src/components/landing/AdminSettingsModal.tsx` | Update `handleAddFaq` to call edge function and insert all languages |

### UX Flow
1. Admin selects any language (e.g. EN), writes question + answer
2. Clicks "Add"
3. System auto-translates to TL, IT, DE and inserts all 4 rows
4. Admin can still switch languages and manually refine any translation

