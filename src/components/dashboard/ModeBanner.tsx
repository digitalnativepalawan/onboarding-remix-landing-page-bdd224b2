import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Play, Link2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModeBannerProps {
  mode: "demo" | "live";
  hasData?: boolean;
}

const ModeBanner = ({ mode, hasData = false }: ModeBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  if (mode === "demo") {
    return (
      <div className="relative bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Demo Mode — Sample Data
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  You are viewing sample bookings, expenses, and profit.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex gap-2 border-primary/30 hover:bg-primary/10"
                onClick={() => navigate("/setup?mode=live")}
              >
                <Link2 className="w-3.5 h-3.5" />
                Connect My Resort Data
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="sm:hidden"
                onClick={() => navigate("/setup?mode=live")}
              >
                <Link2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setDismissed(true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Live mode with no data
  if (!hasData) {
    return (
      <div className="relative bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Waiting for Your First Data
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Your dashboard will update automatically when bookings or expenses are added.
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => setDismissed(true)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ModeBanner;
