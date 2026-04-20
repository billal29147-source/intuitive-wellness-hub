import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedLogo from "./AnimatedLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AuthScreen = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = mode === "signin" ? signIn(email, password) : signUp(email, password);
      setLoading(false);
      if (!res.ok) toast.error(res.error || "Something went wrong");
      else toast.success(mode === "signin" ? "Welcome back!" : "Account created!");
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background px-6 overflow-y-auto">
      <div className="w-full max-w-sm flex flex-col items-center animate-slide-up">
        <AnimatedLogo size={120} />
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to continue your journey" : "Start tracking your health"}
        </p>

        <form onSubmit={handleSubmit} className="w-full mt-8 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground ml-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={255}
              className="glass-card mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground ml-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              maxLength={100}
              className="glass-card mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 h-11 font-semibold"
            style={{
              background: "linear-gradient(90deg, hsl(195 85% 55%), hsl(270 70% 60%))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === "signin"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
