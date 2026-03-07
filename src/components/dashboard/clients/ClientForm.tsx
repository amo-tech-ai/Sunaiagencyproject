// C110-CLIENT-FORM — Create/edit client modal form
// Mobile-first: full-width on xs, max-w-lg centered on sm+, 44px touch targets.

import type { Client } from '../../../lib/supabase';
import { useState } from 'react';
import { X } from 'lucide-react';

interface ClientFormProps {
  initial?: Partial<Client>;
  onSubmit: (data: Partial<Client>) => Promise<void>;
  onClose: () => void;
  loading: boolean;
  title: string;
}

const STATUS_OPTIONS = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'active', label: 'Active' },
  { value: 'churned', label: 'Churned' },
];

export default function ClientForm({ initial, onSubmit, onClose, loading, title }: ClientFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    industry: initial?.industry || '',
    status: initial?.status || 'prospect',
    health_score: initial?.health_score || 50,
    contact_name: initial?.contact_name || '',
    contact_email: initial?.contact_email || '',
    revenue: initial?.revenue || 0,
    notes: initial?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded border border-[#E8E8E4] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E4]">
          <h3 className="font-[Georgia,serif] text-base font-semibold text-[#1A1A1A]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#9CA39B] hover:text-[#1A1A1A] min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B6B63] mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px]"
              placeholder="Acme Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px]"
                placeholder="Technology"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px] bg-white"
              >
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Contact Name</label>
              <input
                type="text"
                value={form.contact_name}
                onChange={e => set('contact_name', e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px]"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Contact Email</label>
              <input
                type="email"
                value={form.contact_email}
                onChange={e => set('contact_email', e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px]"
                placeholder="jane@acme.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Health Score (0-100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.health_score}
                onChange={e => set('health_score', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Revenue ($)</label>
              <input
                type="number"
                min={0}
                value={form.revenue}
                onChange={e => set('revenue', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B63] mb-1">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="w-full px-3 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00875A] resize-none"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded border border-[#E8E8E4] text-sm text-[#6B6B63] hover:bg-[#F5F5F0] transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="flex-1 px-4 py-2.5 rounded bg-[#1A1A1A] text-[#F5F5F0] text-sm hover:bg-[#333] transition-colors min-h-[44px] disabled:opacity-50"
            >
              {loading ? 'Saving...' : (initial?.name ? 'Update Client' : 'Create Client')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
