import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Menu, X, MessageCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const NAV_LINKS = [
  { label: "Products", href: "#our-apps" },
  { label: "Benefits", href: "#benefits" },
  { label: "Blog", href: "#blog" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentLogo = theme === "dark"
    ? (settings.logo_dark_url || settings.logo_light_url)
    : (settings.logo_light_url || settings.logo_dark_url);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.08]"
            : "bg-transparent"
        }`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <a href="/" aria-label="Home" className="shrink-0 hover:opacity-80 transition-opacity">
              {currentLogo ? (
                <img src={currentLogo} alt="Logo" className="h-8 md:h-9 w-auto object-contain" />
              ) : (
                <span className="font-display text-lg font-bold text-[#F0EDE8]">PC</span>
              )}
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-[#888888] hover:text-[#F0EDE8] transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://wa.me/639474443597"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 h-10 rounded-[4px] bg-[#FF4D2E] text-white text-sm font-medium hover:bg-[#e6432a] transition-colors duration-200 min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                Talk to Us
              </a>
              <button
                onClick={() => navigate("/admin")}
                className="text-[#888888] hover:text-[#F0EDE8] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </nav>

            {/* Mobile: settings + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => navigate("/admin")}
                className="text-[#888888] hover:text-[#F0EDE8] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="text-[#F0EDE8] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col">
          <div className="flex items-center justify-between h-14 px-5">
            <a href="/" aria-label="Home" className="shrink-0">
              {currentLogo ? (
                <img src={currentLogo} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <span className="font-display text-lg font-bold text-[#F0EDE8]">PC</span>
              )}
            </a>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-[#F0EDE8] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-2xl font-display font-semibold text-[#F0EDE8] hover:text-[#FF4D2E] transition-colors text-left min-h-[44px]"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="px-8 pb-10">
            <a
              href="https://wa.me/639474443597"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-[4px] bg-[#FF4D2E] text-white text-base font-medium min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              Talk to Us
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
