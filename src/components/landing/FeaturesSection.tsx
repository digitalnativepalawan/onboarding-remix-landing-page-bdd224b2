import { useState } from "react";
import { 
  LayoutDashboard, 
  Clock, 
  Utensils, 
  MessageCircle, 
  ScanLine, 
  Settings,
  Download,
  ArrowRight
} from "lucide-react";
import FeatureDetailModal from "./FeatureDetailModal";
import TimesheetDetailModal from "./TimesheetDetailModal";
import OTRScanDetailModal from "./OTRScanDetailModal";
import DeveloperToolsModal from "./DeveloperToolsModal";
import FoodOrderingModal from "./FoodOrderingModal";
import occupancyPreview from "@/assets/occupancy-profit-dashboard.jpg";
import timesheetPreview from "@/assets/timesheet-clockin.jpg";
import otrScanPreview from "@/assets/otr-scan-review.jpg";
import developerPreview from "@/assets/developer-dashboard.jpg";
import foodOrderPreview from "@/assets/food-order-menu-management.jpg";

const tools = [
  {
    icon: LayoutDashboard,
    title: "Occupancy & Profit",
    description: "See live occupancy, revenue, expenses, and break-even at a glance.",
    color: "primary" as const,
    hasDetail: true,
    preview: occupancyPreview,
    previewPosition: "bottom" as const
  },
  {
    icon: Clock,
    title: "Timesheet & Payroll",
    description: "Clock-in, lunch, clock-out. Payroll and schedules automated.",
    color: "secondary" as const,
    hasTimesheetDetail: true,
    preview: timesheetPreview
  },
  {
    icon: Utensils,
    title: "Online Food Orders",
    description: "Guest mobile ordering. Menu, inventory, and food costs managed.",
    color: "primary" as const,
    hasFoodOrderDetail: true,
    preview: foodOrderPreview
  },
  {
    icon: MessageCircle,
    title: "BitChat",
    description: "Offline Bluetooth messaging for staff. No signal required.",
    color: "secondary" as const,
    downloadUrl: "https://bitchat.free/"
  },
  {
    icon: ScanLine,
    title: "OTR Scan",
    description: "Scan receipts from markets and stores. Generate clean PDFs.",
    color: "primary" as const,
    hasOTRDetail: true,
    preview: otrScanPreview
  },
  {
    icon: Settings,
    title: "Developer Tools",
    description: "Admin settings and system control for power users.",
    color: "secondary" as const,
    hasDeveloperDetail: true,
    preview: developerPreview
  }
];

const FeaturesSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [isOTRModalOpen, setIsOTRModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [isFoodOrderModalOpen, setIsFoodOrderModalOpen] = useState(false);

  const openModal = (tool: typeof tools[0]) => {
    if (tool.hasDetail) setIsModalOpen(true);
    if (tool.hasTimesheetDetail) setIsTimesheetModalOpen(true);
    if (tool.hasOTRDetail) setIsOTRModalOpen(true);
    if (tool.hasDeveloperDetail) setIsDeveloperModalOpen(true);
    if (tool.hasFoodOrderDetail) setIsFoodOrderModalOpen(true);
  };

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 bg-muted/20">
      <div className="px-5 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="section-tag mb-3">Tools</span>
          <h2 className="section-title mb-2">Everything You Need</h2>
          <p className="section-subtitle mx-auto">
            Built for Palawan resort owners who need real control
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {tools.map((tool) => (
            <div 
              key={tool.title}
              className="glass-card p-4 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  tool.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                }`}>
                  <tool.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-normal mb-0.5">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Preview Image */}
              {tool.preview && (
                <div 
                  className="relative overflow-hidden rounded-md border border-border/30 cursor-pointer group mb-3"
                  onClick={() => openModal(tool)}
                >
                  <img 
                    src={tool.preview} 
                    alt={`${tool.title} Preview`} 
                    className={`w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105 ${tool.previewPosition === 'bottom' ? 'object-bottom' : 'object-top'}`}
                  />
                  <div className="absolute inset-0 bg-background/5 group-hover:bg-background/0 transition-colors" />
                </div>
              )}

              {/* Action Button */}
              {(tool.hasDetail || tool.hasTimesheetDetail || tool.hasOTRDetail || tool.hasDeveloperDetail || tool.hasFoodOrderDetail) && (
                <button
                  onClick={() => openModal(tool)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/5 text-primary text-xs transition-all hover:bg-primary/10 hover:border-primary/40 w-fit"
                >
                  View Details
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {/* BitChat Download */}
              {tool.downloadUrl && (
                <a
                  href={tool.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/5 text-primary text-xs transition-all hover:bg-primary/10 hover:border-primary/40 w-fit mt-auto"
                >
                  <Download className="w-3 h-3" />
                  Download BitChat
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <FeatureDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <TimesheetDetailModal open={isTimesheetModalOpen} onOpenChange={setIsTimesheetModalOpen} />
      <OTRScanDetailModal open={isOTRModalOpen} onOpenChange={setIsOTRModalOpen} />
      <DeveloperToolsModal open={isDeveloperModalOpen} onOpenChange={setIsDeveloperModalOpen} />
      <FoodOrderingModal open={isFoodOrderModalOpen} onOpenChange={setIsFoodOrderModalOpen} />
    </section>
  );
};

export default FeaturesSection;
