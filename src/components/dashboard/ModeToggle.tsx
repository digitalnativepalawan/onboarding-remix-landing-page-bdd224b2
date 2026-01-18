import { useNavigate, useSearchParams } from "react-router-dom";

const ModeToggle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "demo";

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`cursor-pointer transition-colors ${
          mode === "demo" 
            ? "text-primary font-medium" 
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => navigate("/dashboard?mode=demo")}
      >
        Demo
      </span>
      <span className="text-border">|</span>
      <span
        className={`cursor-pointer transition-colors ${
          mode === "live" 
            ? "text-primary font-medium" 
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => navigate("/dashboard?mode=live")}
      >
        Switch to Live
      </span>
    </div>
  );
};

export default ModeToggle;
