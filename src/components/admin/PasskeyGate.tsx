import { useState, useEffect, ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSKEY = "5309";
const STORAGE_KEY = "admin_unlocked";
const ALLOWED_EMAILS = ["growpalawan@gmail.com", "david@merqato.digital"];

interface PasskeyGateProps {
  children: ReactNode;
}

export function PasskeyGate({ children }: PasskeyGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      } else {
        const { data } = await supabase.auth.getSession();
        const userEmail = data.session?.user?.email?.toLowerCase();
        if (userEmail && ALLOWED_EMAILS.includes(userEmail)) {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setUnlocked(true);
        }
      }
      setChecked(true);
    };
    init();
  }, []);

  const handlePasskey = (e: React.FormEvent) => {
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!ALLOWED_EMAILS.includes(normalized)) {
      toast.error("This email is not authorized");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, "1");
    setUnlocked(true);
    toast.success("Signed in");
  };

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-lg p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Command Center</h1>
              <p className="text-xs text-muted-foreground">Sign in to continue</p>
            </div>
          </div>

          <Tabs defaultValue="passkey" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="passkey">Passkey</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="passkey">
              <form onSubmit={handlePasskey} className="space-y-4 pt-2">
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
                <Button type="submit" className="w-full">Unlock</Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
