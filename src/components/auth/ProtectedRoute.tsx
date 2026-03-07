import { Navigate, Outlet } from "react-router";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1EEEA]">
        <div className="animate-pulse text-[#0A211F]/40" style={{ fontFamily: "Lora, serif" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
