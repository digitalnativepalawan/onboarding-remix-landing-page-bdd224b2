

## Plan: Sync All FAQ Languages with English

### Problem
English has 3 FAQs (display_order 10, 11, 12). The other languages (DE: 8, IT: 8, TL: 7) still have old, unrelated questions from before the consolidation.

### Solution

1. **Delete all non-English FAQs** from the database (DE, IT, TL rows)
2. **Re-translate the 3 English FAQs** into all other languages using the existing `translate-faq` edge function
3. **Insert the translated versions** so all 4 languages have the same 3 questions

### Implementation

This is a data-only fix — no code changes needed. Steps:

1. Run a DELETE query removing all FAQ rows where `language != 'en'`
2. For each of the 3 English FAQs, call the `translate-faq` edge function to get TL/IT/DE translations
3. Insert the 9 translated rows (3 questions × 3 languages) with matching `display_order` values

### Result
All 4 languages will have the same 3 questions, properly translated and in sync.

