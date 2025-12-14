import { X, Wifi, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import otrScanUpload from "@/assets/otr-scan-upload.jpg";
import otrScanReview from "@/assets/otr-scan-review.jpg";

interface OTRScanDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OTRScanDetailModal = ({ open, onOpenChange }: OTRScanDetailModalProps) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full h-[100dvh] md:h-auto md:max-h-[90vh] p-0 gap-0 bg-background border-border/50 overflow-hidden md:rounded-xl rounded-none">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/30 px-4 md:px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-lg md:text-xl font-medium text-foreground">
                  OTR Scan – Receipt Scanner
                </DialogTitle>
                <p className="text-muted-foreground text-sm font-light mt-1">
                  Turn paper receipts into clean, structured digital records
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
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-normal border border-primary/20">
                <Wifi className="w-3 h-3" />
                Offline-friendly
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-normal border border-border/30">
                <MapPin className="w-3 h-3" />
                Built for Palawan operations
              </span>
            </div>

            {/* Images Section */}
            <div className="space-y-4 mb-8">
              <div 
                className="relative overflow-hidden rounded-lg border border-border/40 cursor-pointer group"
                onClick={() => setZoomedImage(otrScanUpload)}
              >
                <img 
                  src={otrScanUpload} 
                  alt="OTR Scan Upload Interface" 
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-background/5 group-hover:bg-background/0 transition-colors duration-200" />
                <span className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Tap to zoom
                </span>
              </div>
              
              <div 
                className="relative overflow-hidden rounded-lg border border-border/40 cursor-pointer group"
                onClick={() => setZoomedImage(otrScanReview)}
              >
                <img 
                  src={otrScanReview} 
                  alt="OTR Scan Review Interface" 
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-background/5 group-hover:bg-background/0 transition-colors duration-200" />
                <span className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Tap to zoom
                </span>
              </div>
            </div>

            {/* Explanation Sections */}
            <div className="space-y-6">
              {/* What this tool does */}
              <div className="glass-card p-4 md:p-5">
                <h3 className="text-sm md:text-base font-medium text-foreground mb-3">What this tool does</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  OTR Scan lets you upload or photograph handwritten, thermal, and official receipts from markets, sari-sari stores, hardware shops, and suppliers. The system automatically reads the receipt and extracts vendor details, item lists, VAT, totals, and dates.
                </p>
              </div>

              {/* How it helps */}
              <div className="glass-card p-4 md:p-5">
                <h3 className="text-sm md:text-base font-medium text-foreground mb-3">How it helps your business</h3>
                <ul className="space-y-2">
                  {[
                    "Converts messy paper receipts into clean digital records",
                    "Automatically categorizes expenses (materials, groceries, fuel, utilities, etc.)",
                    "Supports VAT and non-VAT receipts commonly used in the Philippines",
                    "Generates accountant-ready PDFs"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground text-sm font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dashboard Connection */}
              <div className="glass-card p-4 md:p-5">
                <h3 className="text-sm md:text-base font-medium text-foreground mb-3">How it connects to your dashboard</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Approved receipts are saved and synced to the Palawan Collective expense system. Monthly expenses automatically appear in your Occupancy & Profit Dashboard, helping you track real costs, break-even points, and net profit accurately.
                </p>
              </div>

              {/* Typical Use Cases */}
              <div className="glass-card p-4 md:p-5">
                <h3 className="text-sm md:text-base font-medium text-foreground mb-3">Typical use cases</h3>
                <ul className="space-y-2">
                  {[
                    "Hardware purchases for maintenance",
                    "Market and grocery buying",
                    "Emergency cash purchases",
                    "Official ORs for accounting and compliance"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground text-sm font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/50 shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why it matters */}
              <div className="glass-card p-4 md:p-5 border-primary/20 bg-primary/5">
                <h3 className="text-sm md:text-base font-medium text-foreground mb-3">Why it matters for Palawan resorts</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Works with photos taken on low-signal devices. Designed for the reality of Palawan operations where receipts come in all formats and internet connectivity isn't guaranteed.
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-muted-foreground/70 text-center mt-8 font-light">
              This module is part of the Palawan Collective Operations Dashboard.
            </p>

            {/* Close Button */}
            <div className="mt-6 flex justify-center">
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

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed view" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
};

export default OTRScanDetailModal;
