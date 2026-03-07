// C95-SETTINGS — Account and organization settings at /app/settings
// Shows user profile, org details, and session info from AuthContext.
// Mobile-first responsive. Read-only for MVP (no edit forms yet).

import { useAuth } from '../AuthContext';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import { motion } from 'motion/react';
import { User, Building2, Shield, Clock, Mail, Key, LogOut, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user, accessToken, signOut } = useAuth();
  const { data } = useDashboardData(user?.id || null, accessToken);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Account Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-[#00875A]" />
          <h2 className="font-[Georgia,serif] text-base sm:text-lg font-semibold text-[#1A1A1A]">
            Account
          </h2>
        </div>

        <div className="bg-white rounded border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
          {/* Name */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Name</p>
              <p className="text-sm text-[#1A1A1A] font-medium truncate">
                {user?.name || 'Not set'}
              </p>
            </div>
            <User className="w-4 h-4 text-[#9CA39B] shrink-0" />
          </div>

          {/* Email */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Email</p>
              <p className="text-sm text-[#1A1A1A] truncate">
                {user?.email || 'Unknown'}
              </p>
            </div>
            <Mail className="w-4 h-4 text-[#9CA39B] shrink-0" />
          </div>

          {/* User ID */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">User ID</p>
              <p className="text-xs font-mono text-[#6B6B63] truncate">
                {user?.id || '—'}
              </p>
            </div>
            <Key className="w-4 h-4 text-[#9CA39B] shrink-0" />
          </div>
        </div>
      </section>

      {/* Organization Section */}
      {data?.org && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-[#00875A]" />
            <h2 className="font-[Georgia,serif] text-base sm:text-lg font-semibold text-[#1A1A1A]">
              Organization
            </h2>
          </div>

          <div className="bg-white rounded border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Company</p>
                <p className="text-sm text-[#1A1A1A] font-medium truncate">{data.org.name}</p>
              </div>
              <Building2 className="w-4 h-4 text-[#9CA39B] shrink-0" />
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Industry</p>
                <p className="text-sm text-[#1A1A1A] truncate">{data.org.industry}</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Size</p>
                <p className="text-sm text-[#1A1A1A] truncate">{data.org.size}</p>
              </div>
            </div>

            {data.org.description && (
              <div className="p-4 sm:p-5">
                <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Description</p>
                <p className="text-sm text-[#6B6B63] leading-relaxed line-clamp-3">{data.org.description}</p>
              </div>
            )}
          </div>

          <p className="text-xs text-[#9CA39B] mt-2 px-1">
            Organization data is derived from your wizard analysis. Re-run the wizard to update.
          </p>
        </section>
      )}

      {/* Session & Security */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#00875A]" />
          <h2 className="font-[Georgia,serif] text-base sm:text-lg font-semibold text-[#1A1A1A]">
            Session & Security
          </h2>
        </div>

        <div className="bg-white rounded border border-[#E8E8E4] divide-y divide-[#E8E8E4]">
          {data?.sessionId && (
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Wizard Session</p>
                <p className="text-xs font-mono text-[#6B6B63] truncate">{data.sessionId}</p>
              </div>
              <Clock className="w-4 h-4 text-[#9CA39B] shrink-0" />
            </div>
          )}

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-[#9CA39B] uppercase tracking-wider mb-0.5">Authentication</p>
              <p className="text-sm text-[#1A1A1A]">
                {accessToken ? 'Active session' : 'No active session'}
              </p>
            </div>
            <Shield className="w-4 h-4 text-[#00875A] shrink-0" />
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3">
        <a
          href="/wizard"
          className="flex items-center justify-between px-4 sm:px-5 py-3 bg-white rounded border border-[#E8E8E4] hover:bg-[#F5F5F0] transition-colors min-h-[48px]"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-[#00875A]" />
            <span className="text-sm text-[#1A1A1A]">Re-run Discovery Wizard</span>
          </div>
          <span className="text-xs text-[#9CA39B]">Update your analysis</span>
        </a>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-3 w-full px-4 sm:px-5 py-3 bg-white rounded border border-[#E8E8E4] hover:bg-[#FEF2F2] hover:border-[#FECACA] transition-colors text-left min-h-[48px] disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 text-[#DC2626]" />
          <span className="text-sm text-[#DC2626]">
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </span>
        </button>
      </section>

      {/* Version */}
      <div className="text-xs text-[#9CA39B] text-center pt-4 pb-2">
        Sun AI Agency · Dashboard v0.13.0
      </div>
    </motion.div>
  );
}
