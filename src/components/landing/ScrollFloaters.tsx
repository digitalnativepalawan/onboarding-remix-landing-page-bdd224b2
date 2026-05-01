import { ChevronUp, ChevronDown } from "lucide-react";

const ScrollFloaters = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed right-4 bottom-20 z-50 flex flex-col gap-2">
      <button
        onClick={scrollToTop}
        className="w-11 h-11 rounded-lg flex items-center justify-center text-[#888888] hover:text-[#FF4D2E] transition-all duration-200 shadow-lg min-h-[44px] min-w-[44px]"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
        }}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <button
        onClick={scrollToBottom}
        className="w-11 h-11 rounded-lg flex items-center justify-center text-[#888888] hover:text-[#FF4D2E] transition-all duration-200 shadow-lg min-h-[44px] min-w-[44px]"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
        }}
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ScrollFloaters;
