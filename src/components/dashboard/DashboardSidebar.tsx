// C80-SIDEBAR — Dashboard left navigation with active state
// Mobile: hamburger overlay (240px). Tablet (md-lg): icon-only 64px. Desktop (lg+): full 240px.
// Mobile-first responsive, 48px min touch targets, Escape key support

import { NavLink, useLocation } from 'react-router';
import { useEffect, useCallback } from 'react';
import {
  LayoutDashboard, FolderKanban, Map, Users, GitBranch, Lightbulb,
  FileText, DollarSign, Bot, Workflow, Settings, Wand2, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/roadmap', label: 'Roadmap', icon: Map },
  { to: '/app/clients', label: 'Clients', icon: Users },
  { to: '/app/crm/pipelines', label: 'CRM Pipeline', icon: GitBranch },
  { to: '/app/insights', label: 'AI Insights', icon: Lightbulb },
  { to: '/app/documents', label: 'Documents', icon: FileText },
  { to: '/app/financial', label: 'Financial', icon: DollarSign },
  { to: '/app/workflows', label: 'Workflows', icon: Workflow },
  { to: '/app/agents', label: 'AI Agents', icon: Bot },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const location = useLocation();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) onClose();
  }, [open, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Dashboard navigation"
        className={`
          fixed top-0 left-0 h-full z-50 bg-[#1A1A1A] flex flex-col
          transition-all duration-200 ease-out
          w-[240px]
          md:static md:z-auto md:translate-x-0 md:w-16
          lg:w-[240px]
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-14 px-4 lg:px-5 border-b border-white/10 shrink-0">
          <NavLink
            to="/app/dashboard"
            className="flex items-center gap-2"
            onClick={onClose}
            aria-label="Sun AI Dashboard home"
          >
            <span className="text-[#00875A] text-lg shrink-0">☀</span>
            <span className="text-[#F5F5F0] font-[Georgia,serif] text-base font-semibold tracking-tight md:hidden lg:inline">
              Sun AI
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="md:hidden text-[#F5F5F0]/60 hover:text-[#F5F5F0] p-2 -mr-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 lg:px-3">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    title={label}
                    className={`
                      flex items-center gap-3 rounded text-sm transition-colors
                      min-h-[44px] px-3 py-2
                      md:justify-center md:px-0 md:py-2.5
                      lg:justify-start lg:px-3 lg:py-2
                      ${isActive
                        ? 'bg-white/10 text-[#F5F5F0]'
                        : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="md:hidden lg:inline">{label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00875A] md:hidden lg:inline-block" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-2 lg:px-3 pb-4 space-y-2 shrink-0 border-t border-white/10 pt-3">
          <NavLink
            to="/wizard"
            onClick={onClose}
            title="Re-run Wizard"
            className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[#00875A] hover:bg-white/5 transition-colors min-h-[44px] md:justify-center md:px-0 lg:justify-start lg:px-3"
          >
            <Wand2 className="w-[18px] h-[18px] shrink-0" />
            <span className="md:hidden lg:inline">Re-run Wizard</span>
            <span className="ml-auto text-xs md:hidden lg:inline">→</span>
          </NavLink>
          <div className="px-3 text-xs text-[#F5F5F0]/30 md:text-center lg:text-left">
            <span className="md:hidden lg:inline">v0.22.0</span>
            <span className="hidden md:inline lg:hidden">v22</span>
          </div>
        </div>
      </aside>
    </>
  );
}