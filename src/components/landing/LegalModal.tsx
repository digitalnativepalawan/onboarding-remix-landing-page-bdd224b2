import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type LegalType = "terms" | "privacy" | "security" | null;

interface LegalModalProps {
  open: LegalType;
  onClose: () => void;
}

const legalContent = {
  terms: {
    title: "Terms of Service",
    sections: [
      {
        heading: "Welcome to Palawan Collective",
        content: `These terms explain how you can use our platform. We're an early-stage company built by a local Palawan resort owner to help other accommodation owners manage daily operations more effectively.`,
      },
      {
        heading: "What We Provide",
        content: `Palawan Collective offers operational tools for small to mid-size accommodations including occupancy tracking, employee timesheets, online ordering, and data management. Our tools are designed to complement your existing booking system (like Cloudbeds), not replace it.`,
      },
      {
        heading: "Your Responsibilities",
        content: `You agree to use the platform honestly and responsibly. You're responsible for keeping your account credentials secure and for any activity that happens under your account. Don't use the platform for anything illegal or harmful.`,
      },
      {
        heading: "Our Responsibilities",
        content: `We'll do our best to keep the platform running smoothly and your data safe. However, we're a small team and things can break. We can't guarantee 100% uptime or that the platform will always work perfectly.`,
      },
      {
        heading: "Pilot Program",
        content: `During the Palawan pilot program, most tools are provided free of charge. This may change as we grow, but we'll always give you advance notice before introducing any fees.`,
      },
      {
        heading: "Changes to These Terms",
        content: `We may update these terms as our platform evolves. We'll notify you of significant changes. Continued use of the platform means you accept the updated terms.`,
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Our Privacy Commitment",
        content: `Your privacy matters to us. This policy explains what information we collect, how we use it, and how we protect it. We believe in transparency and simplicity.`,
      },
      {
        heading: "What We Collect",
        content: `We collect information you provide directly: your name, email, property details, and operational data you enter (bookings, schedules, orders). We also collect basic usage data to improve the platform.`,
      },
      {
        heading: "How We Use Your Data",
        content: `Your data is used to provide our services, improve the platform, and communicate with you about your account. We analyze aggregated, anonymized data to understand how hosts use our tools.`,
      },
      {
        heading: "We Don't Sell Your Data",
        content: `We do not sell, rent, or trade your personal information to third parties. Your data is yours. We only share data when necessary to provide our services (like syncing with Cloudbeds) or when required by law.`,
      },
      {
        heading: "Third-Party Integrations",
        content: `When you connect to Cloudbeds or other booking channels, some data flows between systems. We only sync what's necessary for the integration to work. Each third-party has their own privacy policy.`,
      },
      {
        heading: "Contact Us",
        content: `Questions about privacy? Reach out at info@palawancollective.com or WhatsApp +63 947 444 3597. We're happy to explain anything in more detail.`,
      },
    ],
  },
  security: {
    title: "Data & Security",
    sections: [
      {
        heading: "Your Data, Your Property",
        content: `You own your data. We're just the custodians. You can export your data at any time, and if you ever leave the platform, we'll help you take your data with you.`,
      },
      {
        heading: "How We Protect Your Data",
        content: `We use industry-standard encryption for data in transit and at rest. Our infrastructure is hosted on secure cloud services. We regularly review and update our security practices.`,
      },
      {
        heading: "Cloudbeds Integration",
        content: `Palawan Collective connects to Cloudbeds via secure webhooks. When a booking is made or updated in Cloudbeds, the relevant data syncs to our platform automatically. We only receive what's needed for operations—nothing more.`,
      },
      {
        heading: "Syncing Behavior",
        content: `Data syncs happen in real-time when possible, or in batches when connections are unstable (common in remote Palawan locations). Our system is designed to work reliably even with intermittent internet.`,
      },
      {
        heading: "Access Controls",
        content: `Only you and team members you authorize can access your property data. We implement role-based access so you can control who sees what. Our team only accesses your data when necessary for support.`,
      },
      {
        heading: "Early-Stage Transparency",
        content: `We're a growing platform. Our security practices will mature as we scale. We're committed to being honest about our capabilities and continuously improving protection for your data.`,
      },
    ],
  },
};

const LegalModal = ({ open, onClose }: LegalModalProps) => {
  if (!open) return null;

  const content = legalContent[open];

  return (
    <Dialog open={!!open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 bg-background border-border/50">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-lg font-medium text-foreground">
            {content.title}
          </DialogTitle>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Last updated: December 2024
          </p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(85vh-100px)]">
          <div className="px-6 py-5 space-y-6">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-medium text-foreground/90">
                  {section.heading}
                </h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
            
            <div className="pt-4 border-t border-border/20">
              <p className="text-xs text-muted-foreground/50">
                Questions? Contact us at{" "}
                <a 
                  href="mailto:info@palawancollective.com" 
                  className="text-primary/70 hover:text-primary transition-colors"
                >
                  info@palawancollective.com
                </a>
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
