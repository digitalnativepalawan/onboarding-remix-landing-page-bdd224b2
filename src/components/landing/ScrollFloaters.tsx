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
        className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200 shadow-lg"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <button
        onClick={scrollToBottom}
        className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200 shadow-lg"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ScrollFloaters;
