// C07-DEAL-DETAIL — Sheet panel (slide from right, 400px) for deal details
// Tabs: Details, Interactions, Activity
// Inline interaction logging form

import { useState, useEffect, useCallback } from 'react';
import { X, Phone, Mail, Calendar, FileText, Send, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Deal, Interaction, InteractionCreateInput } from '../../../lib/types/crm-pipeline';
import { pipelineApi } from '../../../lib/supabase';
import { publicAnonKey } from '../../../utils/supabase/info';

interface DealDetailPanelProps {
  deal: Deal | null;
  onClose: () => void;
  onMoveDeal?: (dealId: string, newStageId: string) => void;
  onDeleteDeal?: (dealId: string) => void;
  stages?: { id: string; name: string; position: number; color: string }[];
}

const INTERACTION_TYPES = [
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: Calendar },
  { value: 'note', label: 'Note', icon: FileText },
] as const;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function InteractionIcon({ type }: { type: string }) {
  switch (type) {
    case 'call': return <Phone className="w-3.5 h-3.5" />;
    case 'email': return <Mail className="w-3.5 h-3.5" />;
    case 'meeting': return <Calendar className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
}

export default function DealDetailPanel({
  deal,
  onClose,
  onMoveDeal,
  onDeleteDeal,
  stages = [],
}: DealDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'interactions' | 'activity'>('details');
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [contact, setContact] = useState<any>(null);

  // Interaction form
  const [interactionType, setInteractionType] = useState<'call' | 'email' | 'meeting' | 'note'>('note');
  const [interactionSummary, setInteractionSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = publicAnonKey;

  const fetchDealDetail = useCallback(async () => {
    if (!deal) return;
    setLoadingInteractions(true);
    try {
      const res = await pipelineApi.getDeal(deal.id, token);
      if (res.data) {
        setInteractions(res.data.interactions || []);
        setContact(res.data.contact || null);
      }
    } catch (err) {
      console.error('[DealDetail] Fetch error:', err);
    } finally {
      setLoadingInteractions(false);
    }
  }, [deal, token]);

  useEffect(() => {
    if (deal) {
      fetchDealDetail();
      setActiveTab('details');
    }
  }, [deal?.id, fetchDealDetail]);

  const handleLogInteraction = async () => {
    if (!deal || !interactionSummary.trim()) return;
    setSubmitting(true);
    try {
      const input: InteractionCreateInput = {
        deal_id: deal.id,
        type: interactionType,
        summary: interactionSummary.trim(),
      };
      const res = await pipelineApi.logInteraction(input, token);
      if (res.data?.interaction) {
        setInteractions(prev => [res.data!.interaction, ...prev]);
        setInteractionSummary('');
      }
      if (res.error) console.error('[DealDetail] Log interaction error:', res.error);
    } catch (err) {
      console.error('[DealDetail] Log interaction exception:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Find current stage and next stage
  const currentStage = stages.find(s => s.id === deal?.stage_id);
  const nextStage = stages.find(s => s.position === (currentStage?.position || 0) + 1);

  const tabs = [
    { key: 'details' as const, label: 'Details' },
    { key: 'interactions' as const, label: 'Interactions' },
    { key: 'activity' as const, label: 'Activity' },
  ];

  return (
    <AnimatePresence>
      {deal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E8E8E4] shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-[#1A1A1A] leading-tight">
                    {deal.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-[#00875A]">
                      {formatCurrency(deal.value)}
                    </span>
                    <span className="text-xs text-[#6B6B63]">{deal.probability}%</span>
                    {currentStage && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: currentStage.color }}
                      >
                        {currentStage.name}
                      </span>
                    )}
                  </div>
                  {(deal.contact_name || deal.client_name) && (
                    <p className="text-xs text-[#9CA39B] mt-1">
                      {deal.contact_name || deal.client_name}
                    </p>
                  )}
                  <p className="text-xs text-[#9CA39B] mt-0.5">
                    {deal.daysInStage === 0 ? 'Added today' : `${deal.daysInStage} days in stage`}
                    {deal.isStale && <span className="ml-1">{deal.isVeryStale ? '\uD83D\uDD34' : '\u26A0\uFE0F'}</span>}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-[#F5F5F0] rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close deal detail"
                >
                  <X className="w-5 h-5 text-[#6B6B63]" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E8E8E4] shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 text-xs py-2.5 font-medium transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? 'text-[#00875A] border-[#00875A]'
                      : 'text-[#6B6B63] border-transparent hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  {/* Deal Metadata */}
                  <div className="space-y-2.5">
                    <DetailRow label="Value" value={formatCurrency(deal.value)} />
                    <DetailRow label="Probability" value={`${deal.probability}%`} />
                    <DetailRow label="Expected Close" value={deal.expected_close_date ? formatDate(deal.expected_close_date) : 'Not set'} />
                    <DetailRow label="Created" value={formatDate(deal.created_at)} />
                    <DetailRow label="Stage" value={currentStage?.name || 'Unknown'} />
                  </div>

                  {/* Contact Card */}
                  {contact && (
                    <div className="mt-4 p-3 bg-[#FAFAF8] rounded-lg border border-[#E8E8E4]">
                      <p className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider mb-2">Contact</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{contact.name}</p>
                      {contact.role && <p className="text-xs text-[#6B6B63]">{contact.role}</p>}
                      {contact.email && <p className="text-xs text-[#9CA39B] mt-1">{contact.email}</p>}
                      {contact.phone && <p className="text-xs text-[#9CA39B]">{contact.phone}</p>}
                    </div>
                  )}

                  {/* Notes */}
                  {deal.notes && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap">{deal.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'interactions' && (
                <div className="space-y-4">
                  {/* Log Interaction Form */}
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E8E8E4]">
                    <p className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider mb-2">Log Interaction</p>
                    <div className="flex gap-1.5 mb-2">
                      {INTERACTION_TYPES.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setInteractionType(value)}
                          className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded transition-colors ${
                            interactionType === value
                              ? 'bg-[#00875A] text-white'
                              : 'bg-white text-[#6B6B63] border border-[#E8E8E4] hover:bg-[#F5F5F0]'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={interactionSummary}
                      onChange={(e) => setInteractionSummary(e.target.value)}
                      placeholder="What happened?"
                      rows={2}
                      className="w-full text-sm border border-[#E8E8E4] rounded px-2.5 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#00875A] bg-white text-[#1A1A1A] placeholder:text-[#9CA39B]"
                    />
                    <button
                      onClick={handleLogInteraction}
                      disabled={!interactionSummary.trim() || submitting}
                      className="mt-2 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-[#00875A] text-white rounded hover:bg-[#006B48] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      {submitting ? 'Logging...' : 'Log'}
                    </button>
                  </div>

                  {/* Timeline */}
                  {loadingInteractions ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={`skel-${i}`} className="animate-pulse">
                          <div className="h-3 bg-[#E8E8E4] rounded w-20 mb-1" />
                          <div className="h-4 bg-[#E8E8E4] rounded w-full" />
                        </div>
                      ))}
                    </div>
                  ) : interactions.length === 0 ? (
                    <p className="text-sm text-[#9CA39B] text-center py-6">No interactions logged yet</p>
                  ) : (
                    <div className="space-y-0">
                      {interactions.map((interaction, idx) => (
                        <div
                          key={interaction.id}
                          className={`flex gap-3 pb-4 ${idx < interactions.length - 1 ? 'border-l-2 border-[#E8E8E4] ml-[7px] pl-4' : 'ml-[7px] pl-4'}`}
                        >
                          <div className="absolute -ml-[23px] mt-0.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              interaction.type === 'call' ? 'bg-blue-100 text-blue-600' :
                              interaction.type === 'email' ? 'bg-green-100 text-green-600' :
                              interaction.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              <InteractionIcon type={interaction.type} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-[#1A1A1A] capitalize">{interaction.type}</span>
                              <span className="text-xs text-[#9CA39B]">{formatDate(interaction.created_at)}</span>
                            </div>
                            <p className="text-sm text-[#6B6B63] mt-0.5 leading-relaxed">{interaction.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#9CA39B]">Stage change history will appear here</p>
                  <p className="text-xs text-[#D4CFC8] mt-1">Activity tracking coming soon</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-[#E8E8E4] shrink-0 flex items-center gap-2">
              {nextStage && onMoveDeal && (
                <button
                  onClick={() => onMoveDeal(deal.id, nextStage.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 bg-[#1A1A1A] text-white rounded hover:bg-[#333] transition-colors"
                >
                  Move to {nextStage.name}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {onDeleteDeal && (
                <button
                  onClick={() => { if (confirm('Delete this deal?')) onDeleteDeal(deal.id); }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Delete deal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#6B6B63]">{label}</span>
      <span className="text-sm text-[#1A1A1A] font-medium">{value}</span>
    </div>
  );
}
