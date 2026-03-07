// C112-CLIENTS-LIST — Main clients CRM page at /app/clients
// Shows client table with health/status badges, search, create modal.
// Reads from Supabase `clients` table via Edge Functions (no KV store).
// Mobile-first: card list on xs, table on md+, 44px touch targets.

import { useAuth } from '../../AuthContext';
import { crmApi } from '../../../lib/supabase';
import type { Client } from '../../../lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Plus, Search, Users, RefreshCw, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import ClientHealthBadge from './ClientHealthBadge';
import ClientStatusBadge from './ClientStatusBadge';
import ClientForm from './ClientForm';

export default function ClientsListPage() {
  const { accessToken } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await crmApi.listClients(accessToken || undefined);
      if (res.data?.clients) {
        setClients(res.data.clients);
      }
      if (res.error) {
        setError(res.error);
        console.error('[ClientsList] Fetch error:', res.error);
      }
    } catch (err) {
      setError(String(err));
      console.error('[ClientsList] Fetch exception:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleCreate = async (data: Partial<Client>) => {
    setSaving(true);
    try {
      const res = await crmApi.createClient(data, accessToken || undefined);
      if (res.data?.client) {
        setClients(prev => [res.data!.client, ...prev]);
        setCreating(false);
      }
      if (res.error) console.error('[ClientsList] Create error:', res.error);
    } catch (err) {
      console.error('[ClientsList] Create exception:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client? This cannot be undone.')) return;
    try {
      await crmApi.deleteClient(id, accessToken || undefined);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('[ClientsList] Delete exception:', err);
    }
  };

  const filtered = clients.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q)
      || c.industry?.toLowerCase().includes(q)
      || c.contact_name?.toLowerCase().includes(q)
      || c.status.toLowerCase().includes(q);
  });

  // Summary stats
  const activeCount = clients.filter(c => c.status === 'active').length;
  const prospectCount = clients.filter(c => c.status === 'prospect').length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
      >
        <div className="bg-white rounded border border-[#E8E8E4] p-3 sm:p-4">
          <p className="text-xs text-[#6B6B63]">Total Clients</p>
          <p className="text-lg font-semibold font-mono text-[#1A1A1A]">{clients.length}</p>
        </div>
        <div className="bg-white rounded border border-[#E8E8E4] p-3 sm:p-4">
          <p className="text-xs text-[#6B6B63]">Active</p>
          <p className="text-lg font-semibold font-mono text-[#00875A]">{activeCount}</p>
        </div>
        <div className="bg-white rounded border border-[#E8E8E4] p-3 sm:p-4">
          <p className="text-xs text-[#6B6B63]">Prospects</p>
          <p className="text-lg font-semibold font-mono text-[#0284C7]">{prospectCount}</p>
        </div>
        <div className="bg-white rounded border border-[#E8E8E4] p-3 sm:p-4">
          <p className="text-xs text-[#6B6B63]">Total Revenue</p>
          <p className="text-lg font-semibold font-mono text-[#1A1A1A]">${totalRevenue.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA39B]" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchClients}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#E8E8E4] text-[#6B6B63] hover:bg-[#F5F5F0] min-h-[36px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded bg-[#1A1A1A] text-[#F5F5F0] hover:bg-[#333] transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-white rounded border border-[#E8E8E4] animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
          <p className="text-[#DC2626] text-sm mb-2">Failed to load clients</p>
          <p className="text-xs text-[#6B6B63] mb-4 max-w-md mx-auto">{error}</p>
          <p className="text-xs text-[#9CA39B]">
            If you see a table error, you may need to create the <code className="font-mono bg-[#F5F5F0] px-1 rounded">clients</code> table in your Supabase dashboard first.
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && clients.length === 0 && (
        <div className="bg-white rounded border border-[#E8E8E4] p-8 text-center">
          <Users className="w-10 h-10 text-[#E8E8E4] mx-auto mb-3" />
          <h3 className="font-[Georgia,serif] text-base font-semibold text-[#1A1A1A] mb-1">No clients yet</h3>
          <p className="text-sm text-[#6B6B63] mb-4">Add your first client to start managing relationships.</p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-[#F5F5F0] text-sm rounded hover:bg-[#333] transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add First Client
          </button>
        </div>
      )}

      {/* Table — md+ */}
      {!loading && !error && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded border border-[#E8E8E4] overflow-hidden"
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E4] text-left text-xs text-[#9CA39B]">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Health</th>
                  <th className="px-4 py-3 font-medium text-right">Revenue</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr key={client.id} className="border-b border-[#E8E8E4] last:border-0 hover:bg-[#F5F5F0]/50">
                    <td className="px-4 py-3">
                      <Link to={`/app/clients/${client.id}`} className="text-[#1A1A1A] font-medium hover:text-[#00875A]">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#6B6B63]">{client.industry || '—'}</td>
                    <td className="px-4 py-3"><ClientStatusBadge status={client.status} /></td>
                    <td className="px-4 py-3"><ClientHealthBadge score={client.health_score} /></td>
                    <td className="px-4 py-3 text-right font-mono text-[#6B6B63]">${client.revenue?.toLocaleString() || '0'}</td>
                    <td className="px-4 py-3 text-[#6B6B63] text-xs">{client.contact_name || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-[#9CA39B] hover:text-[#DC2626] p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Delete client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-[#E8E8E4]">
            {filtered.map(client => (
              <Link
                key={client.id}
                to={`/app/clients/${client.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F0]/50 min-h-[56px]"
              >
                <div className="w-9 h-9 rounded bg-[#F5F5F0] flex items-center justify-center text-xs font-medium text-[#6B6B63] shrink-0">
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{client.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ClientStatusBadge status={client.status} />
                    <ClientHealthBadge score={client.health_score} />
                  </div>
                </div>
                <span className="text-xs font-mono text-[#6B6B63] shrink-0">${client.revenue?.toLocaleString() || '0'}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create modal */}
      {creating && (
        <ClientForm
          onSubmit={handleCreate}
          onClose={() => setCreating(false)}
          loading={saving}
          title="Add New Client"
        />
      )}
    </div>
  );
}
