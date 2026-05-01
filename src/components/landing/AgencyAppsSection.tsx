import { useEffect, useState, useRef } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* ─────────────────────────────────────────────────────────────
   PREVIEWS — kept from original, restrained dark canvas
───────────────────────────────────────────────────────────── */

const PREVIEW_BG = "bg-gradient-to-br from-[#11111A] via-[#0F0F14] to-[#0D0D12]";

const BackofficePreview = () => (
  <div className={`p-3 flex flex-col gap-2 ${PREVIEW_BG}`}>
    <div className="flex gap-1.5 items-center rounded-md px-2 py-1.5 bg-white/[0.03] border border-white/5">
      {["Home", "My Work", "Service"].map((t) => (
        <span key={t} className="text-[9px] px-1.5" style={{ color: "#6b7280" }}>{t}</span>
      ))}
      <span className="ml-auto text-[9px]" style={{ color: "#2dd4bf", opacity: 0.7 }}>admin</span>
    </div>
    <div className="flex gap-1">
      {["Reception", "Housekeeping", "Kitchen", "Bar"].map((t, i) => (
        <div
          key={t}
          className="px-2 py-0.5 rounded text-[8px]"
          style={i === 0
            ? { background: "rgba(45,212,191,0.12)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.25)" }
            : { color: "#6b7280" }
          }
        >{t}</div>
      ))}
    </div>
    <div className="grid grid-cols-4 gap-1.5">
      {[
        { label: "Occupancy", val: "0/4", color: "#2dd4bf" },
        { label: "Arrivals",  val: "3",   color: "#2dd4bf" },
        { label: "To Clean",  val: "2",   color: "#f59e0b" },
        { label: "Ready",     val: "2",   color: "#34d399" },
      ].map((s) => (
        <div key={s.label} className="rounded-md p-2 flex flex-col gap-1 bg-white/[0.03] border border-white/5">
          <span className="text-[7px] leading-none" style={{ color: "#6b7280" }}>{s.label}</span>
          <span className="text-base font-bold font-mono leading-none" style={{ color: s.color }}>{s.val}</span>
        </div>
      ))}
    </div>
    <div className="rounded-md px-2 py-1.5 flex items-center gap-1 bg-white/[0.03] border border-white/5">
      <span className="text-[7px] mr-2 shrink-0" style={{ color: "#6b7280" }}>BOOKINGS</span>
      {[
        "rgba(45,212,191,0.45)", "rgba(255,255,255,0.05)", "rgba(245,158,11,0.4)",
        "rgba(255,255,255,0.05)", "rgba(45,212,191,0.3)", "rgba(52,211,153,0.3)", "rgba(255,255,255,0.05)",
      ].map((c, i) => (
        <div key={i} className="flex-1 h-3 rounded-sm" style={{ background: c }} />
      ))}
    </div>
  </div>
);

const TransitPreview = () => (
  <div className={`flex ${PREVIEW_BG}`} style={{ minHeight: 176 }}>
    <div className="flex-1 p-3 flex flex-col justify-between">
      <div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[11px] text-white font-display tracking-[0.15em]">PALAWAN</span>
          <span className="text-[8px] font-display tracking-wider" style={{ color: "#c9a84c" }}>TRANSIT</span>
        </div>
        <p className="text-lg text-white font-display font-bold leading-tight">Move Through</p>
        <p className="text-lg font-display italic leading-tight" style={{ color: "#c9a84c" }}>Palawan.</p>
        <p className="text-[7px] tracking-widest mt-1" style={{ color: "#6b7280" }}>SHUTTLES · BANGKAS</p>
      </div>
      <div className="space-y-1">
        {["Port Barton → El Nido", "Port Barton → Pto. Princesa"].map((r) => (
          <div key={r} className="rounded px-2 py-1 flex items-center justify-between bg-white/[0.03] border border-white/5">
            <span className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.8)" }}>{r}</span>
            <span className="text-[6px] px-1.5 py-0.5 rounded-full" style={{ color: "rgba(201,168,76,0.9)", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>INSTANT</span>
          </div>
        ))}
      </div>
    </div>
    <div className="w-32 p-2">
      <div className="rounded-lg p-2 h-full flex flex-col gap-1.5 bg-white/[0.02] border border-white/5">
        <div className="flex gap-1">
          <div className="px-1.5 py-0.5 rounded" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}>
            <span className="text-[6px] font-mono" style={{ color: "#c9a84c" }}>TRANSPORT</span>
          </div>
          <span className="text-[6px] font-mono self-center" style={{ color: "#6b7280" }}>ISLAND</span>
        </div>
        {[{ label: "FROM", val: "Puerto Princesa" }, { label: "TO", val: "El Nido" }].map((f) => (
          <div key={f.label} className="rounded px-1.5 py-1 bg-white/[0.03] border border-white/5">
            <p className="text-[5px] leading-none mb-0.5" style={{ color: "#6b7280" }}>{f.label}</p>
            <p className="text-[7px] leading-none" style={{ color: "rgba(255,255,255,0.7)" }}>{f.val}</p>
          </div>
        ))}
        <div className="rounded px-1.5 py-1 bg-white/[0.03] border border-white/5">
          <p className="text-[5px] leading-none mb-0.5" style={{ color: "#6b7280" }}>DATE</p>
          <p className="text-[7px] leading-none" style={{ color: "rgba(255,255,255,0.7)" }}>Apr 18, 2026</p>
        </div>
        <div className="rounded px-1.5 py-1.5 text-center mt-auto" style={{ background: "#c9a84c" }}>
          <span className="text-[7px] font-mono font-bold" style={{ color: "#0b1626" }}>FIND ROUTES</span>
        </div>
      </div>
    </div>
  </div>
);

const WildfallPreview = () => (
  <div className="flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#050505", minHeight: 176 }}>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="absolute w-full" style={{ height: 1, top: `${i * 15}%`, background: "rgba(201,168,76,0.04)" }} />
    ))}
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2" style={{ background: "rgba(0,0,0,0.7)" }}>
      <span className="text-[10px] font-display tracking-[0.2em]" style={{ color: "#c9a84c" }}>WILDFALL</span>
      <div className="flex gap-2">
        {["EXPERIENCE", "BATTLEFIELD", "LOGIN"].map((n) => (
          <span key={n} className="text-[6px] font-mono" style={{ color: "#4a4030" }}>{n}</span>
        ))}
      </div>
    </div>
    <div className="flex flex-col items-center pt-8 pb-2">
      <div className="rounded-full px-3 py-0.5 mb-3" style={{ background: "#1a1200", border: "1px solid rgba(58,40,0,0.6)" }}>
        <span className="text-[7px] font-mono tracking-[0.1em]" style={{ color: "#7a5c20" }}>FULL-SCALE LIVE WAR SIMULATION</span>
      </div>
      <p className="text-3xl font-display font-bold tracking-[0.15em] leading-none" style={{ color: "#c9a84c" }}>WILDFALL</p>
      <p className="text-[9px] font-mono tracking-[0.2em] mt-1 mb-4" style={{ color: "#7a5c20" }}>— NO MAN'S JUNGLE —</p>
      <div className="flex items-center">
        {[{ val: "2", label: "DAYS" }, { val: "1", label: "NIGHT" }, { val: "60", label: "HECTARES" }].map((s, i) => (
          <div key={s.label} className="flex items-center">
            {i > 0 && <div className="w-px h-8 mx-4" style={{ background: "#3a2a08" }} />}
            <div className="text-center">
              <p className="text-xl font-display font-bold leading-none" style={{ color: "#c9a84c" }}>{s.val}</p>
              <p className="text-[6px] font-mono tracking-[0.15em] mt-0.5" style={{ color: "#5a4818" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 py-1 text-center" style={{ background: "rgba(10,8,0,0.8)" }}>
      <span className="text-[6px] font-mono tracking-widest" style={{ color: "#3a2a08" }}>SAN VICENTE, PALAWAN · 450M ELEVATION</span>
    </div>
  </div>
);

const SiteBuilderPreview = () => (
  <div className={`p-3 flex flex-col gap-2 ${PREVIEW_BG}`}>
    <div className="flex items-center justify-between rounded-md px-2 py-1.5 bg-white/[0.03] border border-white/5">
      <span className="text-[9px] text-white font-medium">New Business</span>
      <div className="flex gap-1.5">
        <div className="rounded px-2 py-0.5 bg-white/[0.05]">
          <span className="text-[7px]" style={{ color: "#9ca3af" }}>Cancel</span>
        </div>
        <div className="rounded px-2 py-0.5" style={{ background: "#6366f1" }}>
          <span className="text-[7px] text-white">Create</span>
        </div>
      </div>
    </div>
    <div>
      <p className="text-[7px] mb-1.5" style={{ color: "#6b7280" }}>Color Scheme</p>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { name: "Ocean Breeze", c1: "#06b6d4", c2: "#3b82f6", active: false },
          { name: "Tropical Sunset", c1: "#f97316", c2: "#ef4444", active: false },
          { name: "Forest Retreat", c1: "#10b981", c2: "#065f46", active: true },
        ].map((p) => (
          <div key={p.name} className="rounded-md p-1.5 flex items-center gap-1 bg-white/[0.03]" style={{ border: `1px solid ${p.active ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.05)"}` }}>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.c1 }} />
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.c2 }} />
            <span className="text-[6px] truncate" style={{ color: "#9ca3af" }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
    <div>
      <p className="text-[7px] mb-1.5" style={{ color: "#6b7280" }}>Basic Information</p>
      <div className="grid grid-cols-2 gap-1.5">
        {["Business Name", "Location"].map((f) => (
          <div key={f} className="rounded px-2 py-1.5 bg-white/[0.03] border border-white/5">
            <span className="text-[7px]" style={{ color: "#6b7280" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="flex gap-1 flex-wrap">
      {["Modern Clean", "Elegant Classic", "Bold Impact", "Minimal"].map((t, i) => (
        <div key={t} className="rounded-full px-2 py-0.5" style={i === 0
          ? { background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }
          : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#6b7280" }
        }>
          <span className="text-[6px]">{t}</span>
        </div>
      ))}
    </div>
  </div>
);

const OrderPreview = () => (
  <div className={`flex flex-col ${PREVIEW_BG}`} style={{ minHeight: 176 }}>
    <div className="px-3 py-1.5 flex items-center justify-between shrink-0 bg-white/[0.03] border-b border-white/5">
      <span className="text-[9px] text-white font-medium">Order Online</span>
      <div className="flex gap-2">
        {["Order", "Specials"].map((n) => (
          <span key={n} className="text-[7px]" style={{ color: "#9ca3af" }}>{n}</span>
        ))}
      </div>
    </div>
    <div className="flex gap-1 px-2 py-1.5 shrink-0">
      <div className="rounded-full px-2 py-0.5" style={{ background: "#f97316" }}>
        <span className="text-[7px] text-white font-medium">All</span>
      </div>
      {["Baking", "Dairy", "Meats", "Seafood"].map((c) => (
        <div key={c} className="rounded-full px-2 py-0.5 bg-white/[0.03] border border-white/5">
          <span className="text-[7px]" style={{ color: "#9ca3af" }}>{c}</span>
        </div>
      ))}
    </div>
    <div className="flex-1 grid grid-cols-3 gap-1.5 px-2 pb-2">
      {[
        "Baking Spray ₱334", "Burger Slices ₱826", "Camembert ₱321",
        "Cooking Cream ₱526", "Emmentaler ₱1,350", "French Fries ₱478",
      ].map((p) => {
        const [name, price] = p.split(" ₱");
        return (
          <div key={p} className="rounded-lg flex flex-col overflow-hidden bg-white/[0.03] border border-white/5">
            <div className="flex-1 flex items-center justify-center p-2 bg-white/[0.02]">
              <div className="w-6 h-6 rounded bg-white/[0.04] border border-white/5" />
            </div>
            <div className="px-1.5 py-1 flex items-start justify-between gap-1">
              <div className="min-w-0 flex-1">
                <p className="text-[6px] leading-tight truncate text-white">{name}</p>
                <p className="text-[6px] font-mono mt-0.5" style={{ color: "#9ca3af" }}>₱{price}</p>
              </div>
              <div className="rounded-full px-1.5 py-0.5 shrink-0" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
                <span className="text-[5px] uppercase tracking-wide font-medium" style={{ color: "#fb923c" }}>+ Add</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const LandPreview = () => (
  <div className={`p-3 flex flex-col gap-2 ${PREVIEW_BG}`}>
    <div className="flex items-center justify-between rounded-md px-2 py-1.5 bg-white/[0.03] border border-white/5">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)" }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className="text-[9px] text-white font-medium">Sell Your Land</span>
      </div>
      <div className="rounded px-1.5 py-0.5 bg-white/[0.03] border border-white/10">
        <span className="text-[6px]" style={{ color: "#9ca3af" }}>Admin</span>
      </div>
    </div>
    <div className="rounded px-2 py-1.5 bg-white/[0.03] border border-white/5">
      <p className="text-[7px]" style={{ color: "#6b7280" }}>e.g. 2-hectare lot in San Vicente</p>
    </div>
    <div>
      <p className="text-[7px] mb-1" style={{ color: "#6b7280" }}>Terrain</p>
      <div className="flex flex-wrap gap-1">
        {[
          { label: "Flat/Level", a: false }, { label: "Gently sloping", a: false },
          { label: "Beachfront", a: false }, { label: "Forested", a: true },
        ].map((t) => (
          <div key={t.label} className="rounded-full px-2 py-0.5" style={t.a
            ? { background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }
            : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }
          }>
            <span className="text-[6px]">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
    <div>
      <p className="text-[7px] mb-1" style={{ color: "#6b7280" }}>Utilities</p>
      <div className="flex flex-wrap gap-1">
        {[
          { label: "Electricity", a: true }, { label: "Solar power", a: false },
          { label: "Cell signal", a: true }, { label: "Water - spring", a: false },
        ].map((u) => (
          <div key={u.label} className="rounded-full px-2 py-0.5" style={u.a
            ? { background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }
            : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }
          }>
            <span className="text-[6px]">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="flex gap-1.5">
      <div className="rounded-full px-2.5 py-1" style={{ background: "#22c55e" }}>
        <span className="text-[7px] text-white font-medium">Actual Owner</span>
      </div>
      <div className="rounded-full px-2.5 py-1 bg-transparent" style={{ border: "1px solid rgba(34,197,94,0.3)" }}>
        <span className="text-[7px]" style={{ color: "#4ade80" }}>Verified Agent</span>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   PRODUCT METADATA
───────────────────────────────────────────────────────────── */

interface ProductCard {
  preview: React.FC;
  previewBg: string;
  category: string;
  accent: string;
  title: string;
  description: string;
  url: string;
  hostname: string;
}

const UNIFIED_PREVIEW_BG = "#0F0F14";

const PRODUCTS: ProductCard[] = [
  {
    preview: BackofficePreview,
    previewBg: UNIFIED_PREVIEW_BG,
    category: "Resort ops",
    accent: "#2dd4bf",
    title: "BackOffice Resort WebApp",
    description:
      "Full resort operations — reception, housekeeping, kitchen, bar, bookings, payroll, and P&L in one dashboard. Built for small resorts in Palawan.",
    url: "https://euro.palawancollective.com",
    hostname: "euro.palawancollective.com",
  },
  {
    preview: TransitPreview,
    previewBg: UNIFIED_PREVIEW_BG,
    category: "Transportation",
    accent: "#c9a84c",
    title: "Palawan Transit",
    description:
      "Book shuttles and bangkas across Palawan. Operators manage routes, set seats, and get bookings instantly. Tourists book before they even arrive.",
    url: "https://palawan-transit.vercel.app",
    hostname: "palawan-transit.vercel.app",
  },
  {
    preview: WildfallPreview,
    previewBg: "#050505",
    category: "Experience",
    accent: "#c9a84c",
    title: "WildFall Soft Air",
    description:
      "Full-scale live war simulation on 60 hectares in San Vicente, Palawan. Register your team, book your slot, and manage the field — all online.",
    url: "https://wildfallpalawan.vercel.app",
    hostname: "wildfallpalawan.vercel.app",
  },
  {
    preview: SiteBuilderPreview,
    previewBg: UNIFIED_PREVIEW_BG,
    category: "Website builder",
    accent: "#818cf8",
    title: "Your Own Website",
    description:
      "Fill a short form, pick your colors and fonts, and get a professional website for your Palawan business — no coding, no agencies, ready fast.",
    url: "https://site-builder-palawan.vercel.app",
    hostname: "site-builder-palawan.vercel.app",
  },
  {
    preview: OrderPreview,
    previewBg: UNIFIED_PREVIEW_BG,
    category: "Food & orders",
    accent: "#f97316",
    title: "Order Online WebApp",
    description:
      "Online ordering for restaurants and shops. Guests scan a QR code, browse the menu, add to cart and checkout — no app download needed.",
    url: "https://jaycee.palawancollective.com",
    hostname: "jaycee.palawancollective.com",
  },
  {
    preview: LandPreview,
    previewBg: UNIFIED_PREVIEW_BG,
    category: "Real estate",
    accent: "#4ade80",
    title: "Buy Land in Palawan",
    description:
      "List and discover land for sale across Palawan. Verified owner listings with terrain details, utilities, Google Maps, drone video, and title info.",
    url: "https://land.palawancollective.com",
    hostname: "land.palawancollective.com",
  },
];

interface AppLink {
  url: string;
  is_visible: boolean;
}

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const ProductCardView = ({ product, index }: { product: ProductCard; index: number }) => {
  const Preview = product.preview;
  const rgb = hexToRgb(product.accent);
  const isEven = index % 2 === 0;

  return (
    <article className="group glass-card-hover overflow-hidden fade-up-hidden">
      {/* Desktop zigzag: lg grid */}
      <div className={`flex flex-col lg:grid lg:grid-cols-5 ${!isEven ? "lg:[direction:rtl]" : ""}`}>
        {/* Preview zone */}
        <div
          className="lg:col-span-3 relative overflow-hidden lg:[direction:ltr]"
          style={{
            background: product.previewBg,
          }}
        >
          <Preview />
        </div>

        {/* Content zone */}
        <div className="lg:col-span-2 p-6 md:p-7 flex flex-col justify-center lg:[direction:ltr]">
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium"
            style={{
              background: `rgba(${rgb}, 0.15)`,
              color: product.accent,
              border: `1px solid rgba(${rgb}, 0.25)`,
            }}
          >
            {product.category}
          </span>
          <h3 className="mt-3 font-display font-semibold text-[#F0EDE8]">
            {product.title}
          </h3>
          <p className="mt-2 text-sm text-[#888888] leading-relaxed">
            {product.description}
          </p>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium transition-colors duration-200 min-h-[44px] group/link"
            style={{ color: product.accent }}
          >
            View Product
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
};

const AgencyAppsSection = () => {
  const [appLinks, setAppLinks] = useState<AppLink[]>([]);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchAppLinks = async () => {
      const { data } = await supabase
        .from("app_links")
        .select("url, is_visible");
      setAppLinks(data || []);
      setLoaded(true);
    };
    fetchAppLinks();
  }, []);

  // Intersection Observer for fade-up
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const cards = section.querySelectorAll(".fade-up-hidden");
    cards.forEach((card, i) => {
      (card as HTMLElement).style.transitionDelay = `${i * 100}ms`;
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, [loaded]);

  const visibilityMap = new Map(
    appLinks.map((link) => [link.url.replace(/\/$/, ""), link.is_visible])
  );

  const visibleProducts = loaded
    ? PRODUCTS.filter(({ url }) => {
        const normalizedUrl = url.replace(/\/$/, "");
        return visibilityMap.has(normalizedUrl)
          ? visibilityMap.get(normalizedUrl)
          : true;
      })
    : PRODUCTS;

  return (
    <section id="our-apps" ref={sectionRef} className="section-padding bg-[#0a0a0a]">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="section-tag">OUR WEBAPPS</span>
          <h2 className="mt-3 font-display font-semibold tracking-tight text-[#F0EDE8]">
            {visibleProducts.length} live products. Real businesses.
          </h2>
          <p className="mt-4 text-base text-[#888888]">
            Each one built for a specific Palawan business need — and available for your business too.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {visibleProducts.map((product, i) => (
            <ProductCardView key={product.url} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgencyAppsSection;
