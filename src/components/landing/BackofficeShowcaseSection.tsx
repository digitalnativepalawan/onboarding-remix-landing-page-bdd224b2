import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, MessageCircle, X } from "lucide-react";

const GOLD = "#C8A96E";

type CardImage = { path: string; url: string };
type Card = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  images: CardImage[];
  imageRight: boolean;
};

const BrowserMockup = ({ src, alt, onOpen }: { src: string; alt: string; onOpen: () => void }) => (
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
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${alt}`}
        className="block w-full cursor-zoom-in"
      >
        <img src={src} alt={alt} loading="lazy" className="block w-full h-auto object-contain" />
      </button>
    </div>
  </div>
);

const StoryCard = ({ card, onOpenImage }: { card: Card; onOpenImage: (src: string, alt: string) => void }) => (
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
        <div className="space-y-6 md:space-y-8">
          {card.images[0] && (
            <BrowserMockup
              src={card.images[0].url}
              alt={card.title}
              onOpen={() => onOpenImage(card.images[0].url, card.title)}
            />
          )}
          {card.images.slice(1).map((img, i) => (
            <div key={img.path || i} className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] md:max-w-full">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[24px] blur-2xl opacity-50"
                style={{ background: `radial-gradient(circle at 50% 50%, ${GOLD}22, transparent 70%)` }}
              />
              <button
                type="button"
                onClick={() => onOpenImage(img.url, card.title)}
                aria-label={`Open ${card.title} image ${i + 2}`}
                className="relative block w-full cursor-zoom-in"
              >
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  className="block w-full h-auto rounded-lg shadow-2xl ring-1 ring-white/10 bg-white"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </article>
);

const BackofficeShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!lightbox) setZoomed(false);
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const { data: cards = [] } = useQuery({
    queryKey: ["resort-os-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resort_os_cards")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => ({
        id: r.id,
        eyebrow: r.eyebrow || "",
        title: r.title || "",
        body: r.body || "",
        bullets: Array.isArray(r.bullets) ? (r.bullets as string[]) : [],
        images: Array.isArray(r.images) ? (r.images as CardImage[]) : [],
        imageRight: !!r.image_right,
      })) as Card[];
    },
  });

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
  }, [cards]);

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
        {cards.length > 0 && (
        <div className="mt-14 md:mt-20 space-y-12 md:space-y-20">
          {cards.map((c) => (
            <StoryCard key={c.id} card={c} onOpenImage={(src, alt) => setLightbox({ src, alt })} />
          ))}
        </div>
        )}

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

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm overflow-auto overscroll-contain animate-in fade-in duration-150"
          style={{ touchAction: "pinch-zoom" }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Close image"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-6 md:p-10">
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((z) => !z);
              }}
              className={
                zoomed
                  ? "w-auto max-w-none h-auto max-h-none rounded-lg shadow-2xl cursor-zoom-out select-none"
                  : "max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl cursor-zoom-in select-none"
              }
              style={zoomed ? { width: "200%" } : undefined}
              draggable={false}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default BackofficeShowcaseSection;