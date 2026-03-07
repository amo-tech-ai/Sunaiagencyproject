// C-FINANCIAL-PAGE — Phase 13: Financial Dashboard
// Revenue metrics, invoice management, payment tracking, revenue charts, profitability
// BCG design system: #F5F5F0 bg, #1A1A1A text, #00875A accents, Georgia headings

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign, TrendingUp, AlertTriangle, Plus, Search, X,
  Send, CreditCard, Trash2, FileText, BarChart3, ChevronDown,
  CheckCircle2, Clock, Eye, Bell,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAuth } from '../../AuthContext';
import { financialApi } from '../../../lib/supabase';
import type {
  Invoice, RevenueMetrics, ProjectProfitability,
  RevenueTrendPoint, RevenueByClient, RevenueByService,
  InvoiceCreateInput,
} from '../../../lib/types/financial';
import {
  INVOICE_STATUS_CONFIG, formatCurrency, formatCompactCurrency,
} from '../../../lib/types/financial';
import type { InvoiceStatus, InvoiceStatusFilter, PaymentMethod } from '../../../lib/types/financial';

export default function FinancialDashboardPage() {
  const { accessToken } = useAuth();
  const token = accessToken || undefined;

  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [profitability, setProfitability] = useState<ProjectProfitability[]>([]);
  const [chartData, setChartData] = useState<{
    byClient: RevenueByClient[];
    byService: RevenueByService[];
    trend: RevenueTrendPoint[];
  } | null>(null);

  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, invoicesRes, chartsRes, profitRes] = await Promise.all([
        financialApi.getMetrics(token),
        financialApi.listInvoices({ status: statusFilter, search: searchQuery }, token),
        financialApi.getCharts(token),
        financialApi.getProfitability(token),
      ]);
      if (metricsRes.data) setMetrics(metricsRes.data);
      if (invoicesRes.data) setInvoices(invoicesRes.data.invoices || []);
      if (chartsRes.data) setChartData(chartsRes.data);
      if (profitRes.data) setProfitability(profitRes.data.profitability || []);
    } catch (err) {
      setError(`Failed to load financial data: ${err}`);
      console.error('[Financial]', err);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (id: string, newStatus: InvoiceStatus) => {
    const res = await financialApi.updateInvoice(id, { status: newStatus } as any, token);
    if (res.data?.invoice) {
      setInvoices(prev => prev.map(inv => inv.id === id ? res.data!.invoice : inv));
      fetchData(); // Refresh metrics
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Delete this draft invoice?')) return;
    const res = await financialApi.deleteInvoice(id, token);
    if (res.data?.success) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      fetchData();
    }
  };

  const handleSendReminder = async (id: string) => {
    const res = await financialApi.sendReminder(id, token);
    if (res.data?.success) {
      alert(res.data.message);
    }
  };

  const handleRecordPayment = async (invoiceId: string, amount: number, method: PaymentMethod) => {
    const res = await financialApi.recordPayment({
      invoice_id: invoiceId,
      amount,
      payment_date: new Date().toISOString().slice(0, 10),
      method,
    }, token);
    if (res.data) {
      setShowPaymentModal(null);
      fetchData();
    }
  };

  const handleCreateInvoice = async (data: InvoiceCreateInput) => {
    const res = await financialApi.createInvoice(data, token);
    if (res.data?.invoice) {
      setShowCreateInvoice(false);
      fetchData();
    }
  };

  // Status filter counts
  const statusCounts = {
    all: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[#00875A] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-[Georgia,serif] text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
            Financials
          </h1>
          <p className="text-sm text-[#6B6B63] mt-1">
            Revenue tracking, invoices, and project profitability
          </p>
        </div>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00875A] text-white text-sm font-medium rounded-lg hover:bg-[#006D48] transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Overdue Alert Banner */}
      {metrics && metrics.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {metrics.overdue_count} invoice{metrics.overdue_count !== 1 ? 's' : ''} overdue totaling{' '}
              <strong>{formatCurrency(metrics.overdue)}</strong>
            </span>
          </div>
          <button
            onClick={() => setStatusFilter('overdue')}
            className="text-xs text-red-700 font-medium hover:underline min-h-[36px] px-2"
          >
            View &rarr;
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <MetricsRow metrics={metrics} />

      {/* Main Grid: Invoices (left 60%) + Charts (right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 mb-8">
        {/* Left: Invoice Table */}
        <div>
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto">
            {(['all', 'draft', 'sent', 'paid', 'overdue'] as InvoiceStatusFilter[]).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap min-h-[32px] transition-colors ${
                  statusFilter === status
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-[#F5F5F0] text-[#6B6B63] hover:bg-[#E8E8E4]'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1 opacity-70">{statusCounts[status]}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA39B]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-9 pr-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
            />
          </div>

          {/* Invoice List */}
          {invoices.length === 0 ? (
            <div className="text-center py-10 bg-white border border-[#E8E8E4] rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-[#9CA39B]" />
              <p className="text-sm text-[#6B6B63]">No invoices found</p>
              <button
                onClick={() => setShowCreateInvoice(true)}
                className="mt-3 text-sm text-[#00875A] hover:underline"
              >
                Create your first invoice
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteInvoice}
                  onSendReminder={handleSendReminder}
                  onRecordPayment={(id) => setShowPaymentModal(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Charts */}
        <div className="space-y-6">
          {/* Revenue Trend */}
          <div className="bg-white border border-[#E8E8E4] rounded-lg p-4">
            <h3 className="font-[Georgia,serif] text-sm font-semibold text-[#1A1A1A] mb-3">Revenue Trend</h3>
            {chartData?.trend && chartData.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6B63' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B6B63' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E8E4' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#00875A"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#00875A' }}
                    strokeDasharray={(d: any) => ''}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-[#9CA39B]">
                No revenue data yet
              </div>
            )}
          </div>

          {/* Revenue by Client */}
          <div className="bg-white border border-[#E8E8E4] rounded-lg p-4">
            <h3 className="font-[Georgia,serif] text-sm font-semibold text-[#1A1A1A] mb-3">Revenue by Client</h3>
            {chartData?.byClient && chartData.byClient.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData.byClient} layout="vertical" margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6B6B63' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="client_name" tick={{ fontSize: 11, fill: '#6B6B63' }} width={55} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E8E4' }}
                  />
                  <Bar dataKey="total" fill="#00875A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-xs text-[#9CA39B]">
                No client data yet
              </div>
            )}
          </div>

          {/* Revenue by Service */}
          <div className="bg-white border border-[#E8E8E4] rounded-lg p-4">
            <h3 className="font-[Georgia,serif] text-sm font-semibold text-[#1A1A1A] mb-3">Revenue by Service</h3>
            {chartData?.byService && chartData.byService.length > 0 ? (
              <div className="space-y-2">
                {chartData.byService.map((svc, i) => {
                  const colors = ['#00875A', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
                  return (
                    <div key={svc.service} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                      <span className="text-xs text-[#6B6B63] flex-1 truncate">{svc.service}</span>
                      <span className="text-xs font-medium text-[#1A1A1A]">{svc.percentage}%</span>
                      <div className="w-20 h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${svc.percentage}%`, backgroundColor: colors[i % colors.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[100px] flex items-center justify-center text-xs text-[#9CA39B]">
                No service data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profitability Table */}
      <div className="bg-white border border-[#E8E8E4] rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-[#E8E8E4]">
          <h3 className="font-[Georgia,serif] text-base font-semibold text-[#1A1A1A]">Project Profitability</h3>
        </div>
        {profitability.length === 0 ? (
          <div className="text-center py-8 text-sm text-[#6B6B63]">No project data yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAF8] text-left">
                  <th className="px-4 py-2.5 font-medium text-[#6B6B63] text-xs">Project</th>
                  <th className="px-4 py-2.5 font-medium text-[#6B6B63] text-xs">Client</th>
                  <th className="px-4 py-2.5 font-medium text-[#6B6B63] text-xs text-right">Budget</th>
                  <th className="px-4 py-2.5 font-medium text-[#6B6B63] text-xs text-right">Invoiced</th>
                  <th className="px-4 py-2.5 font-medium text-[#6B6B63] text-xs text-right">Paid</th>
                  <th className="px-4 py-2.5 font-medium text-[#6B6B63] text-xs text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {profitability.map((proj) => {
                  const marginColor = proj.margin_pct >= 30 ? 'text-[#00875A]'
                    : proj.margin_pct >= 15 ? 'text-amber-600'
                    : 'text-[#DC2626]';
                  return (
                    <tr key={proj.project_id} className="border-t border-[#E8E8E4] hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3 font-medium text-[#1A1A1A]">{proj.project_name}</td>
                      <td className="px-4 py-3 text-[#6B6B63]">{proj.client_name}</td>
                      <td className="px-4 py-3 text-right text-[#6B6B63]">{formatCurrency(proj.budget)}</td>
                      <td className="px-4 py-3 text-right text-[#6B6B63]">{formatCurrency(proj.invoiced)}</td>
                      <td className="px-4 py-3 text-right text-[#1A1A1A] font-medium">{formatCurrency(proj.paid)}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${marginColor}`}>
                        {proj.margin_pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showCreateInvoice && (
          <CreateInvoiceModal
            onSave={handleCreateInvoice}
            onCancel={() => setShowCreateInvoice(false)}
          />
        )}
      </AnimatePresence>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <RecordPaymentModal
            invoiceId={showPaymentModal}
            invoice={invoices.find(i => i.id === showPaymentModal)!}
            onRecord={handleRecordPayment}
            onCancel={() => setShowPaymentModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Metrics Row ──
function MetricsRow({ metrics }: { metrics: RevenueMetrics | null }) {
  if (!metrics) return null;

  const cards = [
    {
      label: 'MRR', value: formatCurrency(metrics.mrr),
      trend: metrics.mrr_trend, icon: DollarSign, isOverdue: false,
    },
    {
      label: 'Revenue This Period', value: formatCurrency(metrics.revenue_this_period),
      trend: metrics.revenue_trend, icon: TrendingUp, isOverdue: false,
    },
    {
      label: 'Outstanding', value: formatCurrency(metrics.outstanding),
      sub: `${metrics.outstanding_count} invoice${metrics.outstanding_count !== 1 ? 's' : ''}`,
      trend: 0, icon: Clock, isOverdue: false,
    },
    {
      label: 'Overdue', value: formatCurrency(metrics.overdue),
      sub: `${metrics.overdue_count} invoice${metrics.overdue_count !== 1 ? 's' : ''}`,
      trend: 0, icon: AlertTriangle, isOverdue: metrics.overdue > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`border rounded-lg p-4 ${
            card.isOverdue ? 'bg-[#FEF2F2] border-red-200' : 'bg-white border-[#E8E8E4]'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-[#6B6B63] mb-1">
            <card.icon className={`w-3.5 h-3.5 ${card.isOverdue ? 'text-[#DC2626]' : ''}`} />
            {card.label}
          </div>
          <div className={`font-[Georgia,serif] text-xl sm:text-2xl ${card.isOverdue ? 'text-[#DC2626]' : 'text-[#1A1A1A]'}`}>
            {card.value}
          </div>
          {card.trend > 0 && (
            <div className="text-xs mt-1 text-[#00875A]">{'\u25B2'} +{card.trend}%</div>
          )}
          {card.sub && (
            <div className="text-xs mt-1 text-[#9CA39B]">{card.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Invoice Row ──
function InvoiceRow({
  invoice, onStatusChange, onDelete, onSendReminder, onRecordPayment,
}: {
  invoice: Invoice;
  onStatusChange: (id: string, status: InvoiceStatus) => void;
  onDelete: (id: string) => void;
  onSendReminder: (id: string) => void;
  onRecordPayment: (id: string) => void;
}) {
  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status];

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg p-3 sm:p-4 hover:border-[#C8C8C4] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono text-[#9CA39B]">{invoice.invoice_number}</span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
            >
              {statusConfig.label}
            </span>
          </div>
          <h4 className="text-sm font-medium text-[#1A1A1A] truncate">{invoice.client_name}</h4>
          <p className="text-xs text-[#6B6B63] truncate">{invoice.project_name}</p>
        </div>

        <div className="text-right shrink-0">
          <div className="font-[Georgia,serif] text-lg font-semibold text-[#1A1A1A]">
            {formatCurrency(invoice.amount)}
          </div>
          <div className="text-xs text-[#9CA39B]">
            Due {invoice.due_date}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {invoice.status === 'draft' && (
            <button
              onClick={() => onStatusChange(invoice.id, 'sent')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded hover:bg-blue-100 min-h-[32px] transition-colors"
              title="Send Invoice"
            >
              <Send className="w-3 h-3" />
              Send
            </button>
          )}
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <>
              <button
                onClick={() => onRecordPayment(invoice.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-green-50 text-[#00875A] rounded hover:bg-green-100 min-h-[32px] transition-colors"
                title="Record Payment"
              >
                <CreditCard className="w-3 h-3" />
                Pay
              </button>
              <button
                onClick={() => onSendReminder(invoice.id)}
                className="p-1.5 text-amber-600 bg-amber-50 rounded hover:bg-amber-100 min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors"
                title="Send Reminder"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {invoice.status === 'draft' && (
            <button
              onClick={() => onDelete(invoice.id)}
              className="p-1.5 text-red-500 bg-red-50 rounded hover:bg-red-100 min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create Invoice Modal ──
function CreateInvoiceModal({
  onSave, onCancel,
}: {
  onSave: (data: InvoiceCreateInput) => void;
  onCancel: () => void;
}) {
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!clientName.trim() || !amount) return;
    setSaving(true);
    await onSave({
      client_id: '',
      client_name: clientName,
      project_id: '',
      project_name: projectName || 'General',
      amount: parseFloat(amount),
      due_date: dueDate,
      line_items: [{ description: projectName || 'Services', quantity: 1, unit_price: parseFloat(amount) }],
      notes,
    });
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4 pt-8 sm:pt-16"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E8E8E4]">
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#1A1A1A]">Create Invoice</h2>
          <button onClick={onCancel} className="p-2 text-[#6B6B63] hover:text-[#1A1A1A] min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#6B6B63] mb-1">Client Name *</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B6B63] mb-1">Project Name</label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
              placeholder="AI Transformation Phase 1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA39B]">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
                  placeholder="8,500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B6B63] mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] resize-none"
              placeholder="Payment terms, special instructions..."
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#E8E8E4]">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-[#6B6B63] hover:text-[#1A1A1A] min-h-[40px]">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !clientName.trim() || !amount}
            className="px-5 py-2 text-sm font-medium bg-[#00875A] text-white rounded-lg hover:bg-[#006D48] disabled:opacity-50 min-h-[40px] transition-colors"
          >
            {saving ? 'Creating...' : 'Create Draft'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Record Payment Modal ──
function RecordPaymentModal({
  invoiceId, invoice, onRecord, onCancel,
}: {
  invoiceId: string;
  invoice: Invoice;
  onRecord: (invoiceId: string, amount: number, method: PaymentMethod) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState(String(invoice?.amount || 0));
  const [method, setMethod] = useState<PaymentMethod>('bank_transfer');
  const [recording, setRecording] = useState(false);

  const handleRecord = async () => {
    setRecording(true);
    await onRecord(invoiceId, parseFloat(amount), method);
    setRecording(false);
  };

  if (!invoice) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4 pt-8 sm:pt-16"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E8E8E4]">
          <h2 className="font-[Georgia,serif] text-base font-semibold text-[#1A1A1A]">Record Payment</h2>
          <button onClick={onCancel} className="p-2 text-[#6B6B63] hover:text-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-[#F5F5F0] rounded-lg p-3">
            <div className="text-xs text-[#6B6B63]">{invoice.invoice_number} &middot; {invoice.client_name}</div>
            <div className="font-[Georgia,serif] text-lg font-semibold text-[#1A1A1A]">{formatCurrency(invoice.amount)}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B6B63] mb-1">Payment Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA39B]">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B6B63] mb-1">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="check">Check</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#E8E8E4]">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-[#6B6B63] min-h-[40px]">Cancel</button>
          <button
            onClick={handleRecord}
            disabled={recording || !amount}
            className="px-5 py-2 text-sm font-medium bg-[#00875A] text-white rounded-lg hover:bg-[#006D48] disabled:opacity-50 min-h-[40px] transition-colors"
          >
            {recording ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
