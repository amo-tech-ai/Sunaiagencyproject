// C90-PLACEHOLDER — Stub page for dashboard routes not yet implemented
// Mobile-first: responsive padding, 44px min touch targets on back link

import { Link } from 'react-router';
import { ArrowLeft, Wand2 } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  phase: string;
}

export function PlaceholderPage({ title, description, phase }: PlaceholderPageProps) {
  return (
    <div className="max-w-md mx-auto text-center py-8 sm:py-16 px-4">
      <div className="w-12 h-12 bg-[#F5F5F0] border border-[#E8E8E4] rounded flex items-center justify-center mx-auto mb-4">
        <Wand2 className="w-5 h-5 text-[#6B6B63]" />
      </div>
      <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-2">{title}</h2>
      <p className="text-sm text-[#6B6B63] mb-1 leading-relaxed">{description}</p>
      <p className="text-xs text-[#9CA39B] mb-6">Implementation: {phase}</p>
      <Link
        to="/app/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[#00875A] hover:underline min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#00875A]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>
    </div>
  );
}

// Pre-configured placeholder pages for each route
export function ProjectsListPage() {
  return <PlaceholderPage title="Projects" description="Track all active projects and roadmap progress" phase="Phase 4" />;
}

export function ProjectDetailPage() {
  return <PlaceholderPage title="Project Delivery" description="Kanban board, timeline, milestones, and task management" phase="Phase 7" />;
}

export function ClientsPage() {
  return <PlaceholderPage title="Client Management" description="CRM table with client health scores and engagement tracking" phase="Phase 6" />;
}

export function CRMPipelinePage() {
  return <PlaceholderPage title="CRM Pipeline" description="Kanban deal board with forecast charts and AI deal scoring" phase="Phase 8" />;
}

export function AIInsightsPage() {
  return <PlaceholderPage title="AI Insights" description="Full 5-step analysis review with radar charts and snapshots" phase="Phase 9" />;
}

export function DocumentsPage() {
  return <PlaceholderPage title="Documents" description="Proposals, contracts, deliverables, and file organization" phase="Phase 12" />;
}

export function FinancialPage() {
  return <PlaceholderPage title="Financial" description="Revenue tracking, invoices, payments, and project profitability" phase="Phase 13" />;
}

export function WorkflowsPage() {
  return <PlaceholderPage title="Workflow Automation" description="Triggers, logic chains, and automated actions" phase="Phase 11" />;
}

export function AgentsPage() {
  return <PlaceholderPage title="AI Agent Management" description="Agent catalog, run history, performance, and cache management" phase="Phase 10" />;
}

export function SettingsPage() {
  return <PlaceholderPage title="Settings" description="Account, organization, billing, and team management" phase="Phase 5" />;
}
