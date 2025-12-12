import { 
  LayoutDashboard, 
  Clock, 
  Utensils, 
  MessageCircle, 
  ScanLine, 
  Settings,
  Download
} from "lucide-react";

const tools = [
  {
    icon: LayoutDashboard,
    title: "Occupancy & Profit Dashboard",
    description: "Shows live occupancy, revenue, break-even, expenses, add-ons, and forecasting. Get a complete financial picture at a glance.",
    color: "primary" as const
  },
  {
    icon: Clock,
    title: "Employee Timesheet & Payroll",
    description: "Clock-in → lunch → clock-out, payroll calculations, schedules, and staff task management — all automated.",
    color: "secondary" as const
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
    color: "primary" as const
  },
  {
    icon: Settings,
    title: "External / Developer Tools",
    description: "Links for admin-only settings, GitHub, and system management. Full control over your resort ecosystem.",
    color: "secondary" as const
  }
];

const FeaturesSection = () => {
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
                  {'downloadUrl' in tool && tool.downloadUrl && (
                    <a
                      href={tool.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-normal transition-all duration-200 hover:bg-primary/10 hover:border-primary/50"
                    >
                      <Download className="w-3 h-3" />
                      Download BitChat
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;