import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import developerDashboard from "@/assets/developer-dashboard.jpg";
import bingaBeachDashboard from "@/assets/binga-beach-dashboard.jpg";

interface DeveloperToolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeveloperToolsModal = ({ open, onOpenChange }: DeveloperToolsModalProps) => {
  const capabilities = [
    "Download bookings, transactions, income, and expense data synced from Cloudbeds",
    "View real-time financial performance (income vs expenses, profit & loss)",
    "Export data for accounting, tax reporting, and audits",
    "Access admin-only tools, GitHub repositories, and system configurations",
    "Manage integrations, automation logic, and webhook-driven updates",
    "Maintain full operational visibility without switching platforms"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[100dvh] md:h-[85vh] md:max-h-[85vh] p-0 gap-0 bg-background border-border/50 overflow-hidden md:rounded-xl rounded-none flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/30 px-4 md:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg md:text-xl font-medium text-foreground">
                External & Developer Tools — System Control Center
              </DialogTitle>
              <p className="text-muted-foreground text-sm font-light mt-1">
                This is the heart of your resort dashboard.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-md hover:bg-muted/50 transition-colors shrink-0"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-4 md:px-6 py-6">
          {/* Dashboard Image */}
          <div className="relative overflow-hidden rounded-lg border border-border/40 mb-8">
            <img 
              src={developerDashboard} 
              alt="Palawan Collective Dashboard" 
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Explanation Section */}
          <div className="space-y-6">
            {/* Headline */}
            <div>
              <h3 className="text-base md:text-lg font-medium text-foreground mb-4">
                Centralized Control Over Your Entire Resort Ecosystem
              </h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                This section acts as the system backbone of Palawan Collective. It is where all operational data converges — bookings, finances, staff activity, and integrations — with Cloudbeds at the core.
              </p>
              <p className="text-muted-foreground text-sm font-light leading-relaxed mt-3">
                Cloudbeds is fully integrated as the source of truth for reservations. Any new booking, cancellation, or date change from Booking.com, Airbnb, Agoda, direct bookings, or iCal syncs automatically into this dashboard.
              </p>
            </div>

            {/* Binga Beach Resort Dashboard Image */}
            <div className="relative overflow-hidden rounded-lg border border-border/40">
              <img 
                src={bingaBeachDashboard} 
                alt="Binga Beach Resort Dashboard" 
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>

            {/* Capabilities */}
            <div className="glass-card p-4 md:p-5">
              <h4 className="text-sm md:text-base font-medium text-foreground mb-3">What you can do</h4>
              <ul className="space-y-2.5">
                {capabilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground text-sm font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlighted Note */}
            <div className="glass-card p-4 md:p-5 border-primary/20 bg-primary/5">
              <p className="text-foreground text-sm md:text-base font-medium text-center">
                "This is where operational truth lives. One dashboard, one source of data, full control."
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onOpenChange(false)}
              className="px-6 py-2.5 rounded-md bg-muted/50 text-foreground text-sm font-normal transition-all duration-200 hover:bg-muted border border-border/30"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperToolsModal;
