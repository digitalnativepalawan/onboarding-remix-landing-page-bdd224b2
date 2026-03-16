import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Setup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">Welcome to Palawan Collective</h1>
              <p className="text-sm text-muted-foreground truncate">Your resort operations platform</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <ExternalLink className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Get Started</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in or create your account to manage bookings, staff, inventory, orders, and expenses — all in one place.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => window.open("https://euro.palawancollective.com/admin", "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            Go to My Account
          </Button>

          <p className="text-xs text-muted-foreground">
            You'll be redirected to euro.palawancollective.com/admin
          </p>
        </div>
      </main>
    </div>
  );
}
