import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* ─────────────────────────────────────────────────────────────
   VISUAL PREVIEWS — each card is fully self-contained dark
───────────────────────────────────────────────────────────── */

const BackofficeVisual = () => (
  <div style={{ background: "#0d1422" }} className="w-full rounded-lg overflow-hidden border border-white/5">
    {/* preview */}
    <div className="p-3 flex flex-col gap-2" style={{ background: "#0d1422" }}>
      {/* nav */}
      <div className="flex gap-1.5 items-center rounded-md px-2 py-1.5" style={{ background: "#131d2e" }}>
        {["Home", "My Work", "Service"].map((t) => (
          <span key={t} className="text-[9px] px-1.5" style={{ color: "#4a6080" }}>{t}</span>
        ))}
        <span className="ml-auto text-[9px]" style={{ color: "#2dd4bf", opacity: 0.6 }}>admin</span>
      </div>
      {/* tabs */}
      <div className="flex gap-1">
        {["Reception", "Housekeeping", "Kitchen", "Bar"].map((t, i) => (
          <div
            key={t}
            className="px-2 py-0.5 rounded text-[8px]"
            style={i === 0
              ? { background: "rgba(45,212,191,0.12)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.2)" }
              : { color: "#4a5568" }
            }
          >{t}</div>
        ))}
      </div>
      {/* stat cards */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "Occupancy", val: "0/4", color: "#2dd4bf" },
          { label: "Arrivals",  val: "3",   color: "#2dd4bf" },
          { label: "To Clean",  val: "2",   color: "#f59e0b" },
          { label: "Ready",     val: "2",   color: "#34d399" },
        ].map((s) => (
          <div key={s.label} className="rounded-md p-2 flex flex-col gap-1" style={{ background: "#131d2e", border: "1px solid rgba(30,58,74,0.6)" }}>
            <span className="text-[7px] leading-none" style={{ color: "#4a6080" }}>{s.label}</span>
            <span className="text-base font-bold font-mono leading-none" style={{ color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>
      {/* booking bar */}
      <div className="rounded-md px-2 py-1.5 flex items-center gap-1" style={{ background: "#131d2e", border: "1px solid rgba(30,58,74,0.6)" }}>
        <span className="text-[7px] mr-2 shrink-0" style={{ color: "#4a6080" }}>BOOKINGS</span>
        {[
          "rgba(45,212,191,0.5)", "rgba(30,45,66,1)", "rgba(245,158,11,0.4)",
          "rgba(30,45,66,1)", "rgba(45,212,191,0.3)", "rgba(52,211,153,0.3)", "rgba(30,45,66,1)",
        ].map((c, i) => (
          <div key={i} className="flex-1 h-3 rounded-sm" style={{ background: c }} />
        ))}
      </div>
    </div>
    {/* body */}
    <div className="px-4 pt-3 pb-4" style={{ background: "#0d1422" }}>
      <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2" style={{ background: "#0f3b33", color: "#2dd4bf" }}>Resort ops</span>
      <h3 className="text-base font-medium mb-1" style={{ color: "#fff" }}>BackOffice Resort WebApp</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>Full resort operations — reception, housekeeping, kitchen, bar, bookings, payroll, and P&L in one dashboard. Built for small resorts in Palawan.</p>
      <a href="https://euro.palawancollective.com" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between w-full rounded-lg px-4 py-3 transition-opacity hover:opacity-90"
        style={{ background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.25)" }}>
        <div>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "rgba(45,212,191,0.6)" }}>LIVE SITE</p>
          <p className="text-sm font-medium" style={{ color: "#2dd4bf" }}>euro.palawancollective.com</p>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#2dd4bf" }} />
      </a>
    </div>
  </div>
);

const TransitVisual = () => (
  <div style={{ background: "#0b1626" }} className="w-full rounded-lg overflow-hidden border border-white/5">
    <div className="flex" style={{ background: "#0b1626", minHeight: 176 }}>
      {/* left */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-[11px] text-white font-serif tracking-[0.15em]">PALAWAN</span>
            <span className="text-[8px] font-serif tracking-wider" style={{ color: "#c9a84c" }}>TRANSIT</span>
          </div>
          <p className="text-lg text-white font-serif font-bold leading-tight">Move Through</p>
          <p className="text-lg font-serif italic leading-tight" style={{ color: "#c9a84c" }}>Palawan.</p>
          <p className="text-[7px] tracking-widest mt-1" style={{ color: "#4a6080" }}>SHUTTLES · BANGKAS</p>
        </div>
        <div className="space-y-1">
          {["Port Barton → El Nido", "Port Barton → Pto. Princesa"].map((r) => (
            <div key={r} className="rounded px-2 py-1 flex items-center justify-between" style={{ background: "#0f1e33", border: "1px solid rgba(30,58,90,0.5)" }}>
              <span className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.8)" }}>{r}</span>
              <span className="text-[6px] px-1.5 py-0.5 rounded-full" style={{ color: "#c9a84c", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>INSTANT</span>
            </div>
          ))}
        </div>
      </div>
      {/* right widget */}
      <div className="w-32 p-2">
        <div className="rounded-lg p-2 h-full flex flex-col gap-1.5" style={{ background: "#0f1e33", border: "1px solid rgba(30,58,90,0.5)" }}>
          <div className="flex gap-1">
            <div className="px-1.5 py-0.5 rounded" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <span className="text-[6px] font-mono" style={{ color: "#c9a84c" }}>TRANSPORT</span>
            </div>
            <span className="text-[6px] font-mono self-center" style={{ color: "#4a6080" }}>ISLAND</span>
          </div>
          {[{ label: "FROM", val: "Puerto Princesa" }, { label: "TO", val: "El Nido" }].map((f) => (
            <div key={f.label} className="rounded px-1.5 py-1" style={{ background: "#131d2e", border: "1px solid rgba(30,58,90,0.4)" }}>
              <p className="text-[5px] leading-none mb-0.5" style={{ color: "#4a6080" }}>{f.label}</p>
              <p className="text-[7px] leading-none" style={{ color: "rgba(255,255,255,0.7)" }}>{f.val}</p>
            </div>
          ))}
          <div className="rounded px-1.5 py-1" style={{ background: "#131d2e", border: "1px solid rgba(30,58,90,0.4)" }}>
            <p className="text-[5px] leading-none mb-0.5" style={{ color: "#4a6080" }}>DATE</p>
            <p className="text-[7px] leading-none" style={{ color: "rgba(255,255,255,0.7)" }}>Apr 18, 2026</p>
          </div>
          <div className="rounded px-1.5 py-1.5 text-center mt-auto" style={{ background: "#c9a84c" }}>
            <span className="text-[7px] font-mono font-bold" style={{ color: "#0b1626" }}>FIND ROUTES</span>
          </div>
        </div>
      </div>
    </div>
    <div className="px-4 pt-3 pb-4" style={{ background: "#0b1626" }}>
      <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2" style={{ background: "#1a1500", color: "#c9a84c" }}>Transportation</span>
      <h3 className="text-base font-medium mb-1" style={{ color: "#fff" }}>Palawan Transit</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>Book shuttles and bangkas across Palawan. Operators manage routes, set seats, and get bookings instantly. Tourists book before they even arrive.</p>
      <a href="https://palawan-transit.vercel.app" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between w-full rounded-lg px-4 py-3 transition-opacity hover:opacity-90"
        style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
        <div>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "rgba(201,168,76,0.6)" }}>LIVE SITE</p>
          <p className="text-sm font-medium" style={{ color: "#c9a84c" }}>palawan-transit.vercel.app</p>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#c9a84c" }} />
      </a>
    </div>
  </div>
);

const WildfallVisual = () => (
  <div style={{ background: "#050505" }} className="w-full rounded-lg overflow-hidden border border-white/5">
    <div className="flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#050505", minHeight: 176 }}>
      {/* subtle lines */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="absolute w-full" style={{ height: 1, top: `${i * 15}%`, background: "rgba(201,168,76,0.04)" }} />
      ))}
      {/* nav */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2" style={{ background: "rgba(0,0,0,0.7)" }}>
        <span className="text-[10px] font-serif tracking-[0.2em]" style={{ color: "#c9a84c" }}>WILDFALL</span>
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
        <p className="text-3xl font-serif font-bold tracking-[0.15em] leading-none" style={{ color: "#c9a84c" }}>WILDFALL</p>
        <p className="text-[9px] font-mono tracking-[0.2em] mt-1 mb-4" style={{ color: "#7a5c20" }}>— NO MAN'S JUNGLE —</p>
        <div className="flex items-center">
          {[{ val: "2", label: "DAYS" }, { val: "1", label: "NIGHT" }, { val: "60", label: "HECTARES" }].map((s, i) => (
            <div key={s.label} className="flex items-center">
              {i > 0 && <div className="w-px h-8 mx-4" style={{ background: "#3a2a08" }} />}
              <div className="text-center">
                <p className="text-xl font-serif font-bold leading-none" style={{ color: "#c9a84c" }}>{s.val}</p>
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
    <div className="px-4 pt-3 pb-4" style={{ background: "#050505" }}>
      <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2" style={{ background: "#1a1200", color: "#c9a84c" }}>Experience</span>
      <h3 className="text-base font-medium mb-1" style={{ color: "#fff" }}>WildFall Soft Air</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>Full-scale live war simulation on 60 hectares in San Vicente, Palawan. Register your team, book your slot, and manage the field — all online.</p>
      <a href="https://wildfallpalawan.vercel.app" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between w-full rounded-lg px-4 py-3 transition-opacity hover:opacity-90"
        style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
        <div>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "rgba(201,168,76,0.5)" }}>LIVE SITE</p>
          <p className="text-sm font-medium" style={{ color: "#c9a84c" }}>wildfallpalawan.vercel.app</p>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#c9a84c" }} />
      </a>
    </div>
  </div>
);

const SiteBuilderVisual = () => (
  <div style={{ background: "#111827" }} className="w-full rounded-lg overflow-hidden border border-white/5">
    <div className="p-3 flex flex-col gap-2" style={{ background: "#111827" }}>
      {/* top bar */}
      <div className="flex items-center justify-between rounded-md px-2 py-1.5" style={{ background: "#1f2937", border: "1px solid rgba(55,65,81,0.5)" }}>
        <span className="text-[9px] text-white font-medium">New Business</span>
        <div className="flex gap-1.5">
          <div className="rounded px-2 py-0.5" style={{ background: "#374151" }}>
            <span className="text-[7px]" style={{ color: "#9ca3af" }}>Cancel</span>
          </div>
          <div className="rounded px-2 py-0.5" style={{ background: "#6366f1" }}>
            <span className="text-[7px] text-white">Create</span>
          </div>
        </div>
      </div>
      {/* palette */}
      <div>
        <p className="text-[7px] mb-1.5" style={{ color: "#6b7280" }}>Color Scheme</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { name: "Ocean Breeze", c1: "#06b6d4", c2: "#3b82f6", active: false },
            { name: "Tropical Sunset", c1: "#f97316", c2: "#ef4444", active: false },
            { name: "Forest Retreat", c1: "#10b981", c2: "#065f46", active: true },
          ].map((p) => (
            <div key={p.name} className="rounded-md p-1.5 flex items-center gap-1" style={{ background: "#1f2937", border: `1px solid ${p.active ? "rgba(99,102,241,0.6)" : "rgba(55,65,81,0.5)"}` }}>
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.c1 }} />
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.c2 }} />
              <span className="text-[6px] truncate" style={{ color: "#9ca3af" }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* fields */}
      <div>
        <p className="text-[7px] mb-1.5" style={{ color: "#6b7280" }}>Basic Information</p>
        <div className="grid grid-cols-2 gap-1.5">
          {["Business Name", "Location"].map((f) => (
            <div key={f} className="rounded px-2 py-1.5" style={{ background: "#1f2937", border: "1px solid rgba(55,65,81,0.5)" }}>
              <span className="text-[7px]" style={{ color: "#4b5563" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      {/* typography chips */}
      <div className="flex gap-1 flex-wrap">
        {["Modern Clean", "Elegant Classic", "Bold Impact", "Minimal"].map((t, i) => (
          <div key={t} className="rounded-full px-2 py-0.5" style={i === 0
            ? { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }
            : { background: "#1f2937", border: "1px solid rgba(55,65,81,0.5)", color: "#4b5563" }
          }>
            <span className="text-[6px]">{t}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="px-4 pt-3 pb-4" style={{ background: "#111827" }}>
      <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2" style={{ background: "#1e1b4b", color: "#818cf8" }}>Website builder</span>
      <h3 className="text-base font-medium mb-1" style={{ color: "#fff" }}>Your Own Website</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>Fill a short form, pick your colors and fonts, and get a professional website for your Palawan business — no coding, no agencies, ready fast.</p>
      <a href="https://site-builder-palawan.vercel.app" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between w-full rounded-lg px-4 py-3 transition-opacity hover:opacity-90"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
        <div>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "rgba(129,140,248,0.6)" }}>LIVE SITE</p>
          <p className="text-sm font-medium" style={{ color: "#818cf8" }}>site-builder-palawan.vercel.app</p>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#818cf8" }} />
      </a>
    </div>
  </div>
);

const OrderVisual = () => (
  <div style={{ background: "#0d1117" }} className="w-full rounded-lg overflow-hidden border border-white/5">
    <div className="flex flex-col" style={{ background: "#0d1117", minHeight: 176 }}>
      {/* nav */}
      <div className="px-3 py-1.5 flex items-center justify-between shrink-0" style={{ background: "#131920", borderBottom: "1px solid rgba(31,41,55,0.5)" }}>
        <span className="text-[9px] text-white font-medium">Order Online</span>
        <div className="flex gap-2">
          {["Order", "Specials"].map((n) => (
            <span key={n} className="text-[7px]" style={{ color: "#6b7280" }}>{n}</span>
          ))}
        </div>
      </div>
      {/* filters */}
      <div className="flex gap-1 px-2 py-1.5 shrink-0">
        <div className="rounded-full px-2 py-0.5" style={{ background: "#f97316" }}>
          <span className="text-[7px] text-white">All</span>
        </div>
        {["Baking", "Dairy", "Meats", "Seafood"].map((c) => (
          <div key={c} className="rounded-full px-2 py-0.5" style={{ background: "#1f2937" }}>
            <span className="text-[7px]" style={{ color: "#6b7280" }}>{c}</span>
          </div>
        ))}
      </div>
      {/* product grid */}
      <div className="flex-1 grid grid-cols-3 gap-1.5 px-2 pb-2">
        {[
          "Baking Spray ₱334", "Burger Slices ₱826", "Camembert ₱321",
          "Cooking Cream ₱526", "Emmentaler ₱1,350", "French Fries ₱478",
        ].map((p) => {
          const [name, price] = p.split(" ₱");
          return (
            <div key={p} className="rounded-md flex flex-col overflow-hidden" style={{ background: "#161c24", border: "1px solid rgba(31,41,55,0.6)" }}>
              <div className="flex-1 flex items-center justify-center p-2" style={{ background: "#1a1a2e" }}>
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(201,168,76,0.25)" }} />
                </div>
              </div>
              <div className="px-1.5 py-1" style={{ background: "#131920" }}>
                <p className="text-[6px] leading-tight truncate" style={{ color: "#d1d5db" }}>{name}</p>
                <p className="text-[6px] font-mono" style={{ color: "#f97316" }}>₱{price}</p>
                <div className="rounded mt-0.5 py-0.5 text-center" style={{ background: "#f97316" }}>
                  <span className="text-[5px] text-white font-medium">+ Add</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <div className="px-4 pt-3 pb-4" style={{ background: "#0d1117" }}>
      <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2" style={{ background: "#1c0a00", color: "#f97316" }}>Food &amp; orders</span>
      <h3 className="text-base font-medium mb-1" style={{ color: "#fff" }}>Order Online WebApp</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>Online ordering for restaurants and shops. Guests scan a QR code, browse the menu, add to cart and checkout — no app download needed.</p>
      <a href="https://jaycee.palawancollective.com" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between w-full rounded-lg px-4 py-3 transition-opacity hover:opacity-90"
        style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
        <div>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "rgba(249,115,22,0.6)" }}>LIVE SITE</p>
          <p className="text-sm font-medium" style={{ color: "#f97316" }}>jaycee.palawancollective.com</p>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#f97316" }} />
      </a>
    </div>
  </div>
);

const LandVisual = () => (
  <div style={{ background: "#0d1f12" }} className="w-full rounded-lg overflow-hidden border border-white/5">
    <div className="p-3 flex flex-col gap-2" style={{ background: "#0d1f12" }}>
      {/* nav */}
      <div className="flex items-center justify-between rounded-md px-2 py-1.5" style={{ background: "#0f2518", border: "1px solid rgba(26,74,46,0.5)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "rgba(22,163,74,0.1)" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-[9px] text-white font-medium">Sell Your Land</span>
        </div>
        <div className="rounded px-1.5 py-0.5" style={{ background: "rgba(26,74,46,0.5)", border: "1px solid rgba(42,106,62,0.4)" }}>
          <span className="text-[6px]" style={{ color: "#4ade80" }}>Admin</span>
        </div>
      </div>
      {/* input */}
      <div className="rounded px-2 py-1.5" style={{ background: "#0f2518", border: "1px solid rgba(26,74,46,0.5)" }}>
        <p className="text-[7px]" style={{ color: "rgba(22,163,74,0.3)" }}>e.g. 2-hectare lot in San Vicente</p>
      </div>
      {/* terrain */}
      <div>
        <p className="text-[7px] mb-1" style={{ color: "rgba(74,222,128,0.4)" }}>Terrain</p>
        <div className="flex flex-wrap gap-1">
          {[
            { label: "Flat/Level", a: true }, { label: "Gently sloping", a: false },
            { label: "Beachfront", a: false }, { label: "Forested", a: true },
          ].map((t) => (
            <div key={t.label} className="rounded-full px-2 py-0.5" style={t.a
              ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }
              : { background: "#0f2518", border: "1px solid rgba(26,74,46,0.4)", color: "rgba(74,222,128,0.25)" }
            }>
              <span className="text-[6px]">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* utilities */}
      <div>
        <p className="text-[7px] mb-1" style={{ color: "rgba(74,222,128,0.4)" }}>Utilities</p>
        <div className="flex flex-wrap gap-1">
          {[
            { label: "Electricity", a: true }, { label: "Solar power", a: false },
            { label: "Cell signal", a: true }, { label: "Water - spring", a: false },
          ].map((u) => (
            <div key={u.label} className="rounded-full px-2 py-0.5" style={u.a
              ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }
              : { background: "#0f2518", border: "1px solid rgba(26,74,46,0.4)", color: "rgba(74,222,128,0.25)" }
            }>
              <span className="text-[6px]">{u.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* listing type */}
      <div className="flex gap-1.5">
        <div className="rounded-full px-2.5 py-1" style={{ background: "#16a34a" }}>
          <span className="text-[7px] text-white font-medium">Actual Owner</span>
        </div>
        <div className="rounded-full px-2.5 py-1" style={{ background: "#0f2518", border: "1px solid rgba(26,74,46,0.5)" }}>
          <span className="text-[7px]" style={{ color: "rgba(74,222,128,0.25)" }}>Sold by Agent</span>
        </div>
      </div>
    </div>
    <div className="px-4 pt-3 pb-4" style={{ background: "#0d1f12" }}>
      <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2" style={{ background: "#052e16", color: "#4ade80" }}>Real estate</span>
      <h3 className="text-base font-medium mb-1" style={{ color: "#fff" }}>Buy Land in Palawan</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>List and discover land for sale across Palawan. Verified owner listings with terrain details, utilities, Google Maps, drone video, and title info.</p>
      <a href="https://land.palawancollective.com" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between w-full rounded-lg px-4 py-3 transition-opacity hover:opacity-90"
        style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
        <div>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "rgba(74,222,128,0.5)" }}>LIVE SITE</p>
          <p className="text-sm font-medium" style={{ color: "#4ade80" }}>land.palawancollective.com</p>
        </div>
        <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#4ade80" }} />
      </a>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────── */

/* Map each visual card to its live URL for matching against app_links in the database */
const CARD_URL_MAP: { component: React.FC; url: string }[] = [
  { component: BackofficeVisual, url: "https://euro.palawancollective.com" },
  { component: TransitVisual, url: "https://palawan-transit.vercel.app" },
  { component: WildfallVisual, url: "https://wildfallpalawan.vercel.app" },
  { component: SiteBuilderVisual, url: "https://site-builder-palawan.vercel.app" },
  { component: OrderVisual, url: "https://jaycee.palawancollective.com" },
  { component: LandVisual, url: "https://land.palawancollective.com" },
];

interface AppLink {
  url: string;
  is_visible: boolean;
}

const AgencyAppsSection = () => {
  const [appLinks, setAppLinks] = useState<AppLink[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  // Use a Map keyed by normalized URL for O(n) lookup
  const visibilityMap = new Map(
    appLinks.map((link) => [link.url.replace(/\/$/, ""), link.is_visible])
  );

  const visibleCards = loaded
    ? CARD_URL_MAP.filter(({ url }) => {
        const normalizedUrl = url.replace(/\/$/, "");
        // If the app exists in the database, respect its is_visible flag.
        // If the app is not in the database, show it by default.
        return visibilityMap.has(normalizedUrl)
          ? visibilityMap.get(normalizedUrl)
          : true;
      })
    : CARD_URL_MAP;

  return (
    <section id="our-apps" className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-tag mb-3">Our webapps</span>
            <h2 className="section-title mb-2">{visibleCards.length} live products. Real businesses.</h2>
            <p className="section-subtitle mx-auto">
              Each one built for a specific Palawan business need — and available for your business too.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {visibleCards.map(({ component: Card, url }) => (
              <Card key={url} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencyAppsSection;
