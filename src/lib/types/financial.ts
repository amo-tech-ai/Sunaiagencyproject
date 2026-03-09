// T-FINANCIAL — TypeScript interfaces for Phase 13: Financial Dashboard
// Invoices, payments, revenue metrics, profitability

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'check' | 'other';
export type InvoiceStatusFilter = 'all' | InvoiceStatus;
export type DatePreset = 'this_month' | 'this_quarter' | 'this_year' | 'custom';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  project_id: string;
  project_name: string;
  amount: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  payment_date: string | null;
  line_items: LineItem[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  notes: string | null;
  recorded_by: string;
  created_at: string;
}

export interface RevenueMetrics {
  mrr: number;
  mrr_trend: number;
  revenue_this_period: number;
  revenue_trend: number;
  outstanding: number;
  outstanding_count: number;
  overdue: number;
  overdue_count: number;
}

export interface ProjectProfitability {
  project_id: string;
  project_name: string;
  client_name: string;
  budget: number;
  invoiced: number;
  paid: number;
  margin_pct: number;
}

export interface RevenueTrendPoint {
  month: string;
  amount: number;
  is_forecast: boolean;
}

export interface RevenueByClient {
  client_name: string;
  total: number;
}

export interface RevenueByService {
  service: string;
  total: number;
  percentage: number;
}

export interface InvoiceCreateInput {
  client_id: string;
  client_name: string;
  project_id: string;
  project_name: string;
  amount: number;
  due_date: string;
  line_items: Omit<LineItem, 'id'>[];
  notes?: string;
}

export interface PaymentRecordInput {
  invoice_id: string;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  notes?: string;
}

// Status badge color config
export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6' },
  sent: { label: 'Sent', color: '#3B82F6', bg: '#EFF6FF' },
  paid: { label: 'Paid', color: '#00875A', bg: '#ECFDF5' },
  overdue: { label: 'Overdue', color: '#DC2626', bg: '#FEF2F2' },
};

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format compact currency (e.g., $47.5K)
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return formatCurrency(amount);
}
