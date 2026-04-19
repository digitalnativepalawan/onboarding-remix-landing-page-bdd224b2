import { useState, useEffect, ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_PASSKEY = "5309";
const STORAGE_KEY = "admin_unlocked";

interface PasskeyGateProps {
  children: ReactNode;
}

export function PasskeyGate({ children }: PasskeyGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    setChecked(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === ADMIN_PASSKEY) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      toast.success("Access granted");
    } else {
      toast.error("Invalid passkey");
      setPasskey("");
    }
  };

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-card border border-border rounded-lg p-6 space-y-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Command Center</h1>
              <p className="text-xs text-muted-foreground">Enter passkey to continue</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passkey">Passkey</Label>
            <Input
              id="passkey"
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              autoFocus
              placeholder="••••"
            />
          </div>
          <Button type="submit" className="w-full">
            Unlock
          </Button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
