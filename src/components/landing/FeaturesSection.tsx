import { useState } from "react";
import { LayoutDashboard, Clock, Utensils, MessageCircle, ScanLine, Settings, Package, Download, ArrowRight } from "lucide-react";
import FeatureDetailModal from "./FeatureDetailModal";
import TimesheetDetailModal from "./TimesheetDetailModal";
import OTRScanDetailModal from "./OTRScanDetailModal";
import DeveloperToolsModal from "./DeveloperToolsModal";
import FoodOrderingModal from "./FoodOrderingModal";
import InventoryModal from "./InventoryModal";
import occupancyPreview from "@/assets/occupancy-profit-dashboard.jpg";
import timesheetPreview from "@/assets/timesheet-clockin.jpg";
import otrScanPreview from "@/assets/otr-scan-review.jpg";
import developerPreview from "@/assets/developer-dashboard.jpg";
import foodOrderPreview from "@/assets/food-order-menu-management.jpg";
import { useTranslation } from "@/contexts/LocaleContext";

const FeaturesSection = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [isOTRModalOpen, setIsOTRModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [isFoodOrderModalOpen, setIsFoodOrderModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const tools = [
    { icon: LayoutDashboard, titleKey: "features.tools.occupancy.title", descKey: "features.tools.occupancy.description", color: "primary" as const, hasDetail: true, preview: occupancyPreview, previewPosition: "bottom" as const },
    { icon: Clock, titleKey: "features.tools.timesheet.title", descKey: "features.tools.timesheet.description", color: "secondary" as const, hasTimesheetDetail: true, preview: timesheetPreview },
    { icon: Utensils, titleKey: "features.tools.foodOrdering.title", descKey: "features.tools.foodOrdering.description", color: "primary" as const, hasFoodOrderDetail: true, preview: foodOrderPreview },
    { icon: MessageCircle, titleKey: "features.tools.bitChat.title", descKey: "features.tools.bitChat.description", color: "secondary" as const, downloadUrl: "https://bitchat.free/" },
    { icon: ScanLine, titleKey: "features.tools.otrScan.title", descKey: "features.tools.otrScan.description", color: "primary" as const, hasOTRDetail: true, preview: otrScanPreview },
    { icon: Package, titleKey: "features.tools.inventory.title", descKey: "features.tools.inventory.description", color: "secondary" as const, hasInventoryDetail: true },
    { icon: Settings, titleKey: "features.tools.developer.title", descKey: "features.tools.developer.description", color: "secondary" as const, hasDeveloperDetail: true, preview: developerPreview }
  ];

  const openModal = (tool: typeof tools[0]) => {
    if (tool.hasDetail) setIsModalOpen(true);
    if (tool.hasTimesheetDetail) setIsTimesheetModalOpen(true);
    if (tool.hasOTRDetail) setIsOTRModalOpen(true);
    if (tool.hasDeveloperDetail) setIsDeveloperModalOpen(true);
    if (tool.hasFoodOrderDetail) setIsFoodOrderModalOpen(true);
    if (tool.hasInventoryDetail) setIsInventoryModalOpen(true);
  };

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 bg-muted/20">
      <div className="px-5 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <span className="section-tag mb-3">{t("features.tag")}</span>
          <h2 className="section-title mb-2">{t("features.title")}</h2>
          <p className="section-subtitle mx-auto">{t("features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {tools.map((tool) => (
            <div key={tool.titleKey} className="glass-card p-4 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tool.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                  <tool.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-normal mb-0.5">{t(tool.titleKey)}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{t(tool.descKey)}</p>
                </div>
              </div>
              {tool.preview && (
                <div className="relative overflow-hidden rounded-md border border-border/30 cursor-pointer group mb-3" onClick={() => openModal(tool)}>
                  <img src={tool.preview} alt={t(tool.titleKey)} className={`w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105 ${tool.previewPosition === 'bottom' ? 'object-bottom' : 'object-top'}`} />
                  <div className="absolute inset-0 bg-background/5 group-hover:bg-background/0 transition-colors" />
                </div>
              )}
              {(tool.hasDetail || tool.hasTimesheetDetail || tool.hasOTRDetail || tool.hasDeveloperDetail || tool.hasFoodOrderDetail || tool.hasInventoryDetail) && (
                <button onClick={() => openModal(tool)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/5 text-primary text-xs transition-all hover:bg-primary/10 hover:border-primary/40 w-fit">
                  {t("features.viewDetails")}<ArrowRight className="w-3 h-3" />
                </button>
              )}
              {tool.downloadUrl && (
                <a href={tool.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/5 text-primary text-xs transition-all hover:bg-primary/10 hover:border-primary/40 w-fit mt-auto">
                  <Download className="w-3 h-3" />{t("features.downloadBitChat")}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <FeatureDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <TimesheetDetailModal open={isTimesheetModalOpen} onOpenChange={setIsTimesheetModalOpen} />
      <OTRScanDetailModal open={isOTRModalOpen} onOpenChange={setIsOTRModalOpen} />
      <DeveloperToolsModal open={isDeveloperModalOpen} onOpenChange={setIsDeveloperModalOpen} />
      <FoodOrderingModal open={isFoodOrderModalOpen} onOpenChange={setIsFoodOrderModalOpen} />
      <InventoryModal open={isInventoryModalOpen} onOpenChange={setIsInventoryModalOpen} />
    </section>
  );
};

export default FeaturesSection;
