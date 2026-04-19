
The user is asking me to test the site settings flow end-to-end. This requires browser automation, which is unavailable in plan mode. I'll present a short plan to run the test.

Steps:
1. Navigate to `/admin/site-settings`
2. Edit Company Name, Address fields, Contact Email/Phone/WhatsApp, and Facebook URL
3. Click Save and confirm toast
4. Reload to verify persistence
5. Navigate to `/` and inspect footer for all updated values + Facebook icon
6. Report results; if any field doesn't reflect, identify the bug in `Footer.tsx` / `useSiteSettings.ts` and propose a fix
