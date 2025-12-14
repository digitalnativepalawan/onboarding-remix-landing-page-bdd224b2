import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Smartphone, 
  Settings2, 
  Calculator, 
  BarChart3, 
  Ship,
  X
} from "lucide-react";
import foodOrderCheckout from "@/assets/food-order-checkout.jpg";
import foodOrderMenuManagement from "@/assets/food-order-menu-management.jpg";
import foodOrderProfitReports from "@/assets/food-order-profit-reports.jpg";

interface FoodOrderingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FoodOrderingModal = ({ open, onOpenChange }: FoodOrderingModalProps) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const images = [
    { src: foodOrderMenuManagement, alt: "Menu Management Dashboard", label: "Menu Management" },
    { src: foodOrderCheckout, alt: "Guest Checkout Screen", label: "Guest Checkout" },
    { src: foodOrderProfitReports, alt: "Profit Reports Dashboard", label: "Profit Reports" },
  ];

  const features = [
    {
      icon: Smartphone,
      title: "Guest Ordering",
      items: [
        "Guests order food, drinks, and tours directly from their phone",
        "Orders can be delivered to: Cabins, Tables, Beach loungers",
        "No apps required — works via browser / QR code"
      ]
    },
    {
      icon: Settings2,
      title: "Admin Menu Management",
      items: [
        "Add / edit menu items with full descriptions",
        "Set prices and food cost per item",
        "Categorize items (Food, Drinks, Tours, Accommodation, Fees)",
        "Toggle availability ON/OFF in real time",
        "Availability changes instantly reflect on guest menus"
      ]
    },
    {
      icon: Calculator,
      title: "Inventory & Cost Control",
      items: [
        "Each item has: Selling price + Food cost",
        "System automatically calculates: Gross profit per item",
        "Tracks total food cost and net profit",
        "Critical for controlling kitchen margins"
      ]
    },
    {
      icon: BarChart3,
      title: "Manager Dashboard & Reports",
      items: [
        "Dedicated Manager Admin role",
        "View reports by: Daily, Weekly, Monthly, Year-to-date",
        "Reports include: Total orders, Revenue, Food cost, Profit",
        "Exportable for accounting and tax reporting"
      ]
    },
    {
      icon: Ship,
      title: "Tours & Add-Ons",
      items: [
        "Same system handles: Island hopping, Tours, Accommodation add-ons, Special fees",
        "Items can be sold before arrival or during stay",
        "Helps increase average booking value"
      ]
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 gap-0 bg-background border-border/50 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl md:text-2xl font-medium text-foreground">
                  Online Food Ordering & Tours System
                </DialogTitle>
                <DialogDescription className="text-sm md:text-base text-muted-foreground font-light mt-2">
                  Guest mobile ordering with real-time availability, cost tracking, and profit reporting — fully controlled by resort admins.
                </DialogDescription>
              </DialogHeader>

              {/* Images Section */}
              <div className="space-y-3 mb-8">
                {images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <span className="text-xs text-muted-foreground font-light">{image.label}</span>
                    <div 
                      className="relative overflow-hidden rounded-lg border border-border/40 cursor-pointer group"
                      onClick={() => setZoomedImage(image.src)}
                    >
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        loading="lazy"
                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-background/5 group-hover:bg-transparent transition-colors duration-200" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        Tap to zoom
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Sections */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-border/30 bg-muted/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-sm md:text-base font-medium text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <ul className="space-y-2 ml-11">
                      {feature.items.map((item, itemIndex) => (
                        <li 
                          key={itemIndex}
                          className="text-xs md:text-sm text-muted-foreground font-light leading-relaxed flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Closing Line */}
              <div className="mt-8 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="text-sm md:text-base text-foreground font-medium text-center">
                  This system turns food, drinks, and tours into a measurable profit center — not guesswork.
                </p>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-6 py-2 rounded-md border border-border/50 bg-muted/30 text-foreground text-sm font-normal transition-all duration-200 hover:bg-muted/50"
                >
                  Close
                </button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
};

export default FoodOrderingModal;
