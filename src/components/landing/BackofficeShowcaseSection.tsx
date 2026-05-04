import { useEffect, useRef } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import baiaLogin from "@/assets/backoffice/baia-login.png";
import baiaGuestPortal from "@/assets/backoffice/baia-guest-portal.png";
import baiaKitchen from "@/assets/backoffice/baia-kitchen.png";
import baiaReception from "@/assets/backoffice/baia-reception.png";
import baiaBill from "@/assets/backoffice/baia-bill.png";

const GOLD = "#C8A96E";

type Card = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  alt: string;
  imageRight: boolean;
};

const cards: Card[] = [
  {
    eyebrow: "THE PLATFORM",
    title: "One login. Every role.",
    body:
      "Guest. Staff. Kitchen. Billing. All connected in one system. No switching apps, no missed updates, no chaos.",
    bullets: ["Guest portal", "Staff dashboard", "Kitchen board", "Admin controls"],
    image: baiaLogin,
    alt: "BAIA Boutique login screen with Guest, Staff, and Admin entry",
    imageRight: true,
  },
  {
    eyebrow: "GUEST PORTAL",
    title: "Guests order from their room.",
    body:
      "No front desk calls. No waiting. Guests tap food, drinks, tours, and services directly from their phone. Everything charged to their room automatically.",
    bullets: ["Order food & drinks", "Book tours & transport", "View live bill", "Sign off digitally"],
    image: baiaGuestPortal,
    alt: "Guest portal with Order Food, Drinks, Experiences, Service tiles",
    imageRight: false,
  },
  {
    eyebrow: "KITCHEN BOARD",
    title: "Orders land instantly.",
    body:
      "The moment a guest orders, kitchen staff see it highlighted in real time. Audio chime. Telegram backup. No paper tickets. No shouting.",
    bullets: ["Live order queue", "New → Preparing → Ready", "Audio + Telegram alerts", "Zero paper"],
    image: baiaKitchen,
    alt: "Kitchen board showing new order ticket and Start Preparing button",
    imageRight: true,
  },
  {
    eyebrow: "RECEPTION DASHBOARD",
    title: "Total visibility. Right now.",
    body:
      "Morning Briefing shows occupancy, arrivals, departures, kitchen queue, and live operations — all updated in real time. One glance, full picture.",
    bullets: ["Morning briefing", "Room status live", "Arrivals & departures", "Pending kitchen orders"],
    image: baiaReception,
    alt: "Reception dashboard with morning briefing and live operations",
    imageRight: false,
  },
  {
    eyebrow: "GUEST BILLING",
    title: "Every peso captured.",
    body:
      "Orders auto-charge to the room folio. Guest reviews their bill, agrees digitally, receipt prints. No missed revenue. No end-of-night surprises.",
    bullets: ["Auto room charges", "Live folio balance", "Digital bill agreement", "Printable receipt"],
    image: baiaBill,
    alt: "Guest bill with itemized room charges and I Agree button",
    imageRight: true,
  },
];

const BrowserMockup = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative">
    <div
      aria-hidden
      className="absolute -inset-6 rounded-[24px] blur-3xl opacity-60"
      style={{ background: `radial-gradient(circle at 50% 50%, ${GOLD}22, transparent 70%)` }}
    />
    <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#0a0a0a]">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      </div>
      <img src={src} alt={alt} loading="lazy" className="block w-full h-auto object-contain" />
    </div>
  </div>
);

const StoryCard = ({ card }: { card: Card }) => (
  <article
    className="fade-up-hidden bg-[#12121F] border rounded-2xl p-7 md:p-12 overflow-hidden"
    style={{ borderColor: `${GOLD}33` }}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={card.imageRight ? "md:order-1" : "md:order-2"}>
        <p
          className="text-[11px] tracking-[0.2em] uppercase font-medium mb-4"
          style={{ color: GOLD }}
        >
          {card.eyebrow}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-[#F5F3EE] leading-tight">
          {card.title}
        </h3>
        <p className="mt-4 text-[#9A9690] font-light leading-relaxed text-sm md:text-base">
          {card.body}
        </p>
        <ul className="mt-6 space-y-2">
          {card.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-[#F5F3EE] font-medium">
              <span style={{ color: GOLD }} className="leading-none mt-1">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={card.imageRight ? "md:order-2" : "md:order-1"}>
        <BrowserMockup src={card.image} alt={card.alt} />
      </div>
    </div>
  </article>
);

const BackofficeShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-up-visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const items = section.querySelectorAll(".fade-up-hidden");
    items.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 100}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="backoffice-showcase"
      ref={sectionRef}
      className="font-poppins bg-[#08080F] py-16 md:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="text-center fade-up-hidden">
          <p
            className="text-[11px] tracking-[0.25em] uppercase font-medium"
            style={{ color: GOLD }}
          >
            Resort Operating System
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F3EE] leading-tight">
            One system.
            <br />
            Every department.
          </h2>
          <p
            className="mt-3 text-2xl sm:text-3xl md:text-4xl italic font-semibold"
            style={{ color: GOLD }}
          >
            Zero chaos.
          </p>
          <p className="mt-6 text-[#9A9690] font-light max-w-xl mx-auto text-sm md:text-base">
            Built for boutique resorts, restaurants, and beach clubs across Southeast Asia.
          </p>
          <div
            className="mx-auto mt-8 h-px w-20"
            style={{ background: GOLD }}
            aria-hidden
          />
        </div>

        {/* Story cards */}
        <div className="mt-14 md:mt-20 space-y-12 md:space-y-20">
          {cards.map((c) => (
            <StoryCard key={c.title} card={c} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="fade-up-hidden mt-16 md:mt-24 rounded-2xl bg-[#0D0D18] border px-6 py-12 md:px-12 md:py-16 text-center"
          style={{ borderColor: `${GOLD}33` }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#F5F3EE]">
            Ready to run your resort smarter?
          </h3>
          <p className="mt-3 text-[#9A9690] font-light text-sm md:text-base">
            Used live at BAIA Boutique, San Vicente — Palawan
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <a
              href="#our-apps"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-md font-semibold text-[#0a0a0a] transition-transform active:scale-[0.98] hover:opacity-90"
              style={{ background: GOLD }}
            >
              See Live Demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/639474443597"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-md font-semibold text-[#F5F3EE] border transition-colors hover:bg-white/5"
              style={{ borderColor: GOLD }}
            >
              <MessageCircle className="w-4 h-4" />
              Talk to Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackofficeShowcaseSection;