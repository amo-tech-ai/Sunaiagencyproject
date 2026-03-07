import { Outlet, Link } from "react-router";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#F1EEEA]">
      <header className="bg-[#0A211F] text-[#F1EEEA] px-6 py-3 flex items-center justify-between">
        <Link
          to="/app"
          className="text-xl font-bold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Sun AI Agency
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-60">{user?.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-[#F1EEEA]/60 hover:text-[#F1EEEA]"
          >
            Sign out
          </Button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
