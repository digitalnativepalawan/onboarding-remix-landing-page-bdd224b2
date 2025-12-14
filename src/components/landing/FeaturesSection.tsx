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
import occupancyPreview from "@/assets/occupancy-dashboard-preview.jpg";
import timesheetPreview from "@/assets/timesheet-clockin.jpg";
import otrScanPreview from "@/assets/otr-scan-review.jpg";

const tools = [
  {
    icon: LayoutDashboard,
    title: "Occupancy & Profit Dashboard",
    description: "Shows live occupancy, revenue, break-even, expenses, add-ons, and forecasting. Get a complete financial picture at a glance.",
    color: "primary" as const,
    hasDetail: true
  },
  {
    icon: Clock,
    title: "Employee Timesheet & Payroll",
    description: "Clock-in → lunch → clock-out, payroll calculations, schedules, and staff task management — all automated.",
    color: "secondary" as const,
    hasTimesheetDetail: true
  },
  {
    icon: Utensils,
    title: "Online Food Ordering System",
    description: "Guest mobile ordering with delivery to units or tables. Admin can set menu items, availability, inventory, and food costs.",
    color: "primary" as const
  },
  {
    icon: MessageCircle,
    title: "BitChat – Offline Bluetooth Messaging",
    description: "A walkie-talkie style Bluetooth mesh chat for staff (and guests in emergencies). Works with no internet, no signal.",
    color: "secondary" as const,
    downloadUrl: "https://bitchat.free/"
  },
  {
    icon: ScanLine,
    title: "OTR Scan – Receipt Scanner",
    description: "Scans handwritten + thermal receipts from markets, sari-sari stores, hardware, and official ORs. Generates clean PDFs.",
    color: "primary" as const,
    hasOTRDetail: true
  },
  {
    icon: Settings,
    title: "External / Developer Tools",
    description: "Links for admin-only settings, GitHub, and system management. Full control over your resort ecosystem.",
    color: "secondary" as const
  }
];

const FeaturesSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [isOTRModalOpen, setIsOTRModalOpen] = useState(false);

  return (
    <section id="features" className="py-16 md:py-20 relative bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-normal tracking-wide border border-border/30 mb-4">
            Tools
          </span>
          <h2 className="section-title mb-3">Everything You Need</h2>
          <p className="section-subtitle mx-auto">
            A comprehensive toolkit designed for modern resort management
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {tools.map((tool, index) => (
            <div 
              key={tool.title}
              className="glass-card-hover p-4 md:p-5 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <div className={`icon-wrapper${tool.color === 'secondary' ? '-secondary' : ''} shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                  <tool.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-medium mb-1">{tool.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-light">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Dashboard Preview Thumbnail */}
              {tool.hasDetail && (
                <div className="mt-4">
                  <div 
                    className="relative overflow-hidden rounded-md border border-border/40 cursor-pointer group/thumbnail"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img 
                      src={occupancyPreview} 
                      alt="Dashboard Preview" 
                      className="w-full h-[120px] md:h-[140px] object-cover object-top transition-transform duration-300 group-hover/thumbnail:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/10 group-hover/thumbnail:bg-background/0 transition-colors duration-200" />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-normal transition-all duration-200 hover:bg-primary/10 hover:border-primary/50"
                  >
                    View Full Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Timesheet Preview Thumbnail */}
              {'hasTimesheetDetail' in tool && tool.hasTimesheetDetail && (
                <div className="mt-4">
                  <div 
                    className="relative overflow-hidden rounded-md border border-border/40 cursor-pointer group/thumbnail"
                    onClick={() => setIsTimesheetModalOpen(true)}
                  >
                    <img 
                      src={timesheetPreview} 
                      alt="Timesheet Preview" 
                      className="w-full h-[120px] md:h-[140px] object-cover object-top transition-transform duration-300 group-hover/thumbnail:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/10 group-hover/thumbnail:bg-background/0 transition-colors duration-200" />
                  </div>
                  <button
                    onClick={() => setIsTimesheetModalOpen(true)}
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-normal transition-all duration-200 hover:bg-primary/10 hover:border-primary/50"
                  >
                    View Full Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* OTR Scan Preview Thumbnail */}
              {'hasOTRDetail' in tool && tool.hasOTRDetail && (
                <div className="mt-4">
                  <div 
                    className="relative overflow-hidden rounded-md border border-border/40 cursor-pointer group/thumbnail"
                    onClick={() => setIsOTRModalOpen(true)}
                  >
                    <img 
                      src={otrScanPreview} 
                      alt="OTR Scan Preview" 
                      className="w-full h-[120px] md:h-[140px] object-cover object-top transition-transform duration-300 group-hover/thumbnail:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/10 group-hover/thumbnail:bg-background/0 transition-colors duration-200" />
                  </div>
                  <button
                    onClick={() => setIsOTRModalOpen(true)}
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-normal transition-all duration-200 hover:bg-primary/10 hover:border-primary/50"
                  >
                    View Full Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* BitChat Download Button */}
              {'downloadUrl' in tool && tool.downloadUrl && (
                <div className="mt-4">
                  <a
                    href={tool.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-normal transition-all duration-200 hover:bg-primary/10 hover:border-primary/50"
                  >
                    <Download className="w-3 h-3" />
                    Download BitChat
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Detail Modals */}
      <FeatureDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <TimesheetDetailModal open={isTimesheetModalOpen} onOpenChange={setIsTimesheetModalOpen} />
      <OTRScanDetailModal open={isOTRModalOpen} onOpenChange={setIsOTRModalOpen} />
    </section>
  );
};

export default FeaturesSection;