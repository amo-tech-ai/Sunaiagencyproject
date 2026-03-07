import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate("/app/dashboard");
  }

  async function handleGoogleSignup() {
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
        Start your AI journey
      </h2>
      <p
        className="text-[#0A211F]/60 mb-8"
        style={{ fontFamily: "Lora, serif" }}
      >
        Create an account to get your personalized AI transformation roadmap
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            required
            className="mt-1"
          />
        </div>
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
            placeholder="Min 8 characters"
            required
            minLength={8}
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#84CC16] hover:bg-[#84CC16]/90 text-[#0A211F] font-semibold"
        >
          {loading ? "Creating account..." : "Create account"}
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
        onClick={handleGoogleSignup}
        className="w-full"
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-[#0A211F]/60">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-[#84CC16] hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
