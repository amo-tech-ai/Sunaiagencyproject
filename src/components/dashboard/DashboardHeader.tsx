// C81-HEADER — Dashboard top header with breadcrumb, notifications, user avatar
// Mobile-first: h-14, 44px min touch targets, sticky, outside-click + Escape close dropdown

import { useLocation, Link } from 'react-router';
import { Menu, Bell, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useState, useRef, useEffect, useCallback } from 'react';

const ROUTE_LABELS: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/projects': 'Projects',
  '/app/roadmap': 'Roadmap',
  '/app/clients': 'Clients',
  '/app/crm/pipelines': 'CRM Pipeline',
  '/app/insights': 'AI Insights',
  '/app/documents': 'Documents',
  '/app/financial': 'Financial',
  '/app/workflows': 'Workflows',
  '/app/agents': 'AI Agents',
  '/app/settings': 'Settings',
};

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = ROUTE_LABELS[location.pathname] || 
    (location.pathname.startsWith('/app/projects/') ? 'Project Detail' :
     location.pathname.startsWith('/app/clients/') ? 'Client Detail' : 'Dashboard');
  const isDashboardHome = location.pathname === '/app/dashboard';
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close dropdown on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setDropdownOpen(false);
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [dropdownOpen, handleKeyDown]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#F5F5F0] border-b border-[#E8E8E4] flex items-center px-3 sm:px-4 lg:px-8 gap-2 sm:gap-4">
      {/* Mobile menu button — hidden on md+ (tablet has icon sidebar) */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-[#1A1A1A]/60 hover:text-[#1A1A1A] min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title / breadcrumb */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        {!isDashboardHome && (
          <>
            <Link
              to="/app/dashboard"
              className="text-xs text-[#9CA39B] hover:text-[#6B6B63] transition-colors hidden sm:inline"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-[#E8E8E4] hidden sm:inline shrink-0" />
          </>
        )}
        <h1 className="font-[Georgia,serif] text-[#1A1A1A] text-base sm:text-lg font-semibold truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Notifications */}
      <button
        className="relative text-[#1A1A1A]/50 hover:text-[#1A1A1A] min-h-[44px] min-w-[44px] flex items-center justify-center rounded transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-[18px] h-[18px]" />
      </button>

      {/* User menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center rounded hover:bg-[#E8E8E4] transition-colors"
          aria-label="User menu"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded bg-[#1A1A1A] text-[#F5F5F0] flex items-center justify-center text-xs font-medium overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              initials
            )}
          </div>
          {/* Show name on desktop only */}
          <span className="text-sm text-[#6B6B63] hidden lg:inline max-w-[120px] truncate">
            {user?.name || user?.email?.split('@')[0]}
          </span>
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#E8E8E4] rounded py-1 z-50"
            role="menu"
          >
            <div className="px-3 py-2.5 border-b border-[#E8E8E4]">
              <p className="text-sm font-medium text-[#1A1A1A] truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-[#6B6B63] truncate">{user?.email}</p>
            </div>
            <Link
              to="/app/settings"
              role="menuitem"
              className="flex items-center gap-2.5 px-3 min-h-[44px] text-sm text-[#1A1A1A] hover:bg-[#F5F5F0] transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#6B6B63]" />
              Settings
            </Link>
            <div className="border-t border-[#E8E8E4] my-0.5" />
            <button
              onClick={() => { setDropdownOpen(false); signOut(); }}
              role="menuitem"
              className="flex items-center gap-2.5 px-3 min-h-[44px] text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors w-full text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}