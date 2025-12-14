import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import occupancyPreview from "@/assets/occupancy-dashboard-preview.png";

interface FeatureDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeatureDetailModal = ({ open, onOpenChange }: FeatureDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-card border-border/50">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/30 px-4 py-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-medium pr-8">
            Occupancy & Profit Dashboard
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Image Preview */}
          <div className="rounded-lg overflow-hidden border border-border/30 bg-muted/20">
            <img
              src={occupancyPreview}
              alt="Occupancy & Profit Dashboard Preview"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Explanation Content */}
          <div className="space-y-5">
            {/* What it is */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                What it is
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                Our Occupancy Heatmap + Profit Dashboard connected to Sirvoy webhooks. 
                Any new booking, cancellation, or date change from all channels automatically 
                updates here—so you avoid double bookings and always see real occupancy.
              </p>
            </div>

            {/* What it does */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                What it does
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Live occupancy heatmap by unit and date (quickly see booked vs open nights)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Break-even + profit tracking: enter monthly expenses and instantly see if occupancy covers costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <div>
                    <span>Forecast & pre-sell add-ons per reservation:</span>
                    <ul className="mt-1 ml-3 space-y-1 text-muted-foreground/80">
                      <li>– Meals / F&B</li>
                      <li>– Tours & island hopping</li>
                      <li>– Extended stays / upgrades</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <div>
                    <span>Export and manage data:</span>
                    <ul className="mt-1 ml-3 space-y-1 text-muted-foreground/80">
                      <li>– Import CSV / Export CSV</li>
                      <li>– Add records manually if needed</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

            {/* Why it matters */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                Why it matters
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                Run your resort like a dashboard: one view for occupancy, costs, and upsells—updated 
                automatically from Sirvoy.
              </p>
            </div>
          </div>

          {/* Close Button for Mobile */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full text-sm font-normal"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDetailModal;
