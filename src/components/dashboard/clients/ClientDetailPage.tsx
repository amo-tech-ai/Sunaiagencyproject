// C111-CLIENT-DETAIL — Single client detail view at /app/clients/:id
// Shows client info, contacts list, edit form.
// Mobile-first: stacked layout, responsive padding, 44px touch targets.

import { useAuth } from '../../AuthContext';
import { crmApi } from '../../../lib/supabase';
import type { Client, CRMContact } from '../../../lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Edit2, Mail, Phone, User, Briefcase, Trash2, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import ClientHealthBadge from './ClientHealthBadge';
import ClientStatusBadge from './ClientStatusBadge';
import ClientForm from './ClientForm';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();

  const [client, setClient] = useState<Client | null>(null);
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchClient = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await crmApi.getClient(id, accessToken || undefined);
      if (res.data) {
        setClient(res.data.client);
        setContacts(res.data.contacts);
      }
      if (res.error) setError(res.error);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [id, accessToken]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const handleUpdate = async (data: Partial<Client>) => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await crmApi.updateClient(id, data, accessToken || undefined);
      if (res.data?.client) setClient(res.data.client);
      setEditing(false);
    } catch (err) {
      console.error('[ClientDetail] Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-white rounded border border-[#E8E8E4] animate-pulse w-48" />
        <div className="h-64 bg-white rounded border border-[#E8E8E4] animate-pulse" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
        <p className="text-[#DC2626] text-sm mb-3">{error || 'Client not found'}</p>
        <Link to="/app/clients" className="text-sm text-[#00875A] hover:underline">Back to Clients</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back link */}
      <Link
        to="/app/clients"
        className="inline-flex items-center gap-1.5 text-sm text-[#00875A] hover:underline min-h-[44px]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All Clients
      </Link>

      {/* Client header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A]">{client.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <ClientStatusBadge status={client.status} />
              <ClientHealthBadge score={client.health_score} />
              {client.industry && (
                <span className="text-xs text-[#6B6B63] flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> {client.industry}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded border border-[#E8E8E4] text-[#1A1A1A] hover:bg-[#F5F5F0] transition-colors min-h-[36px]"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E8E8E4]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-[#9CA39B]" />
              <span className="text-[#1A1A1A]">{client.contact_name || 'No contact'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-[#9CA39B]" />
              <span className="text-[#6B6B63]">{client.contact_email || 'No email'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-[#9CA39B]">Revenue:</span>{' '}
              <span className="font-mono text-[#1A1A1A]">${client.revenue?.toLocaleString() || '0'}</span>
            </div>
            <div className="text-sm">
              <span className="text-[#9CA39B]">Added:</span>{' '}
              <span className="text-[#6B6B63]">{new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {client.notes && (
          <div className="mt-4 pt-4 border-t border-[#E8E8E4]">
            <h4 className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider mb-1">Notes</h4>
            <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
            Contacts ({contacts.length})
          </h3>
        </div>

        {contacts.length === 0 ? (
          <p className="text-sm text-[#9CA39B]">No contacts added yet.</p>
        ) : (
          <div className="divide-y divide-[#E8E8E4]">
            {contacts.map(c => (
              <div key={c.id} className="py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#F5F5F0] flex items-center justify-center text-xs font-medium text-[#6B6B63]">
                  {c.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1A1A]">{c.name}{c.is_primary && <span className="text-[10px] text-[#00875A] ml-1.5">Primary</span>}</p>
                  <p className="text-xs text-[#6B6B63]">{c.role || 'No role'} &middot; {c.email}</p>
                </div>
                {c.phone && (
                  <span className="text-xs text-[#9CA39B] hidden sm:inline">
                    <Phone className="w-3 h-3 inline mr-0.5" />{c.phone}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit modal */}
      {editing && (
        <ClientForm
          initial={client}
          onSubmit={handleUpdate}
          onClose={() => setEditing(false)}
          loading={saving}
          title="Edit Client"
        />
      )}
    </div>
  );
}
