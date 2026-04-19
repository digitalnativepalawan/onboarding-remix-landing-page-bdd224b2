import { useState } from "react";
import AdminSettingsModal from "@/components/landing/AdminSettingsModal";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

/**
 * Site Settings page — hosts the original landing-page settings
 * (logos, FAQs, header link, blog posts, featured apps, feedback).
 * These are settings for the public-facing webapp, not the admin dashboard.
 */
export default function SiteSettingsPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/40 bg-card p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">Website Settings</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Manage the public landing page: logos, FAQs, header link, blog posts,
              featured apps, and feedback.
            </p>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => setOpen(true)}
            >
              Open Settings
            </Button>
          </div>
        </div>
      </div>

      <AdminSettingsModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
