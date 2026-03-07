// C79-LAYOUT — Dashboard shell: sidebar + header + auth guard + outlet
// Mobile-first: full-width content. Tablet (md): 64px icon sidebar. Desktop (lg): 240px sidebar.
// Auth guard with return URL. Skip-to-content a11y link. Safe area padding for mobile.

import { Outlet, Navigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Auth guard — redirect to login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#E8E8E4] border-t-[#00875A] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#6B6B63]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth/login?return=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F5F5F0] flex">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#00875A] focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area — flex-1 takes remaining space after sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
        >
          {/* Mobile-first padding: compact → comfortable → spacious */}
          <div className="max-w-[1200px] mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
