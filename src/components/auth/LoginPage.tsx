import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate("/app/dashboard");
  }

  async function handleGoogleLogin() {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/app/dashboard` },
    });
    if (authError) setError(authError.message);
  }

  return (
    <div>
      <div className="mb-8 lg:hidden">
        <a
          href="/"
          className="text-2xl font-bold text-[#0A211F]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Sun AI Agency
        </a>
      </div>

      <h2
        className="text-3xl font-bold text-[#0A211F] mb-2"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        Welcome back
      </h2>
      <p
        className="text-[#0A211F]/60 mb-8"
        style={{ fontFamily: "Lora, serif" }}
      >
        Sign in to continue your AI transformation journey
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#84CC16] hover:bg-[#84CC16]/90 text-[#0A211F] font-semibold"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#0A211F]/10" />
        <span className="text-sm text-[#0A211F]/40">or</span>
        <div className="flex-1 h-px bg-[#0A211F]/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full"
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-[#0A211F]/60">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="text-[#84CC16] hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
