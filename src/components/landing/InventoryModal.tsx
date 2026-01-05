import { X, Package, ClipboardList, TrendingDown, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface InventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InventoryModal = ({ open, onOpenChange }: InventoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-card border-border/50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/30 px-4 py-3 flex items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-medium pr-8">
            Inventory Management
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Track supplies, materials, and stock levels across your resort operations
          </p>

          {/* Feature Sections */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border/30 bg-muted/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-medium text-foreground">
                  Stock Tracking
                </h3>
              </div>
              <ul className="space-y-2 ml-11 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Add items with quantities, categories, and locations
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Track usage over time
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Set reorder thresholds
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-border/30 bg-muted/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-medium text-foreground">
                  Categorization
                </h3>
              </div>
              <ul className="space-y-2 ml-11 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Kitchen supplies, maintenance materials, cleaning products
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Guest amenities and consumables
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Fuel and utilities tracking
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-border/30 bg-muted/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-medium text-foreground">
                  Cost Awareness
                </h3>
              </div>
              <ul className="space-y-2 ml-11 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Link inventory to purchases from OTR Scan
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Understand consumption patterns
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Reduce waste and over-ordering
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-border/30 bg-muted/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-medium text-foreground">
                  Low Stock Alerts
                </h3>
              </div>
              <ul className="space-y-2 ml-11 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Get notified when items fall below thresholds
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Plan restocking trips to town
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                  Avoid running out of essentials
                </li>
              </ul>
            </div>
          </div>

          {/* Empty State Guidance */}
          <div className="p-4 rounded-lg border border-border/30 bg-muted/10">
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-2">
              When you first open this module
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your inventory list will be empty until you add your first item.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Once you add supplies, materials, or stock, they will appear here for tracking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/60 mt-1">→</span>
                <span className="text-muted-foreground/80 italic">Nothing is broken — this module activates when you start logging inventory.</span>
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground/60 font-light text-center pt-2">
            This module is part of the Palawan Collective Operations Dashboard.
          </p>

          {/* Close Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 rounded-md border border-border/50 bg-muted/30 text-foreground text-sm font-normal transition-all duration-200 hover:bg-muted/50"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryModal;
