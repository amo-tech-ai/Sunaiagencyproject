// C-WORKFLOWS-PAGE — Phase 11: Workflow Automation Dashboard
// Active workflows list, workflow builder, execution log, templates, metrics
// BCG design system: #F5F5F0 bg, #1A1A1A text, #00875A accents, Georgia headings

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Workflow as WorkflowIcon, Play, Pause, Trash2, Plus, Zap, Clock,
  CheckCircle2, XCircle, AlertTriangle, ChevronRight, X, RotateCcw,
  Activity, Timer, BarChart3, Copy, Download,
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { workflowApi } from '../../../lib/supabase';
import type {
  Workflow, WorkflowExecution, WorkflowMetrics, WorkflowCreateInput,
} from '../../../lib/types/workflows';
import {
  WORKFLOW_TEMPLATES, TRIGGER_LABELS, ACTION_LABELS,
} from '../../../lib/types/workflows';
import type { TriggerType, ActionType, WorkflowCondition, WorkflowAction, WorkflowTrigger } from '../../../lib/types/workflows';

type TabId = 'active' | 'templates' | 'executions';

export default function WorkflowAutomationPage() {
  const { accessToken } = useAuth();
  const token = accessToken || undefined;

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Builder state
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [builderName, setBuilderName] = useState('');
  const [builderDescription, setBuilderDescription] = useState('');
  const [builderTrigger, setBuilderTrigger] = useState<WorkflowTrigger>({
    type: 'manual_trigger', source: '', field: '',
  });
  const [builderConditions, setBuilderConditions] = useState<WorkflowCondition[]>([]);
  const [builderActions, setBuilderActions] = useState<WorkflowAction[]>([]);
  const [saving, setSaving] = useState(false);

  // Run state
  const [runningId, setRunningId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [wfRes, metricsRes, execRes] = await Promise.all([
        workflowApi.list(token),
        workflowApi.getMetrics(token),
        workflowApi.getExecutions(undefined, token),
      ]);
      if (wfRes.data) setWorkflows(wfRes.data.workflows || []);
      if (metricsRes.data) setMetrics(metricsRes.data);
      if (execRes.data) setExecutions(execRes.data.executions || []);
    } catch (err) {
      setError(`Failed to load workflows: ${err}`);
      console.error('[Workflows]', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    const res = await workflowApi.toggle(id, newStatus as any, token);
    if (res.data) {
      setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: newStatus as any } : w));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workflow? This cannot be undone.')) return;
    const res = await workflowApi.delete(id, token);
    if (res.data?.success) {
      setWorkflows(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleRun = async (id: string, dryRun: boolean = false) => {
    setRunningId(id);
    try {
      const res = await workflowApi.run(id, dryRun, token);
      if (res.data) {
        if (res.data.workflow) {
          setWorkflows(prev => prev.map(w => w.id === id ? res.data!.workflow : w));
        }
        if (res.data.execution) {
          setExecutions(prev => [res.data!.execution, ...prev]);
        }
      }
    } finally {
      setRunningId(null);
    }
  };

  const handleInstallTemplate = async (idx: number) => {
    const template = WORKFLOW_TEMPLATES[idx];
    const res = await workflowApi.installTemplate(template as WorkflowCreateInput, token);
    if (res.data?.workflow) {
      setWorkflows(prev => [res.data!.workflow, ...prev]);
      setActiveTab('active');
    }
  };

  const openBuilder = (workflow?: Workflow) => {
    if (workflow) {
      setEditingWorkflow(workflow);
      setBuilderName(workflow.name);
      setBuilderDescription(workflow.description);
      setBuilderTrigger(workflow.trigger);
      setBuilderConditions(workflow.conditions);
      setBuilderActions(workflow.actions);
    } else {
      setEditingWorkflow(null);
      setBuilderName('');
      setBuilderDescription('');
      setBuilderTrigger({ type: 'manual_trigger', source: '', field: '' });
      setBuilderConditions([]);
      setBuilderActions([]);
    }
    setShowBuilder(true);
  };

  const closeBuilder = () => {
    setShowBuilder(false);
    setEditingWorkflow(null);
  };

  const handleSaveWorkflow = async () => {
    if (!builderName.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: builderName,
        description: builderDescription,
        trigger: builderTrigger,
        conditions: builderConditions,
        actions: builderActions,
      };
      if (editingWorkflow) {
        const res = await workflowApi.update(editingWorkflow.id, data, token);
        if (res.data?.workflow) {
          setWorkflows(prev => prev.map(w => w.id === editingWorkflow.id ? res.data!.workflow : w));
        }
      } else {
        const res = await workflowApi.create(data, token);
        if (res.data?.workflow) {
          setWorkflows(prev => [res.data!.workflow, ...prev]);
        }
      }
      closeBuilder();
    } finally {
      setSaving(false);
    }
  };

  const addAction = () => {
    setBuilderActions(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'log_activity', target: '', field_mappings: {}, order: prev.length + 1 },
    ]);
  };

  const removeAction = (id: string) => {
    setBuilderActions(prev => prev.filter(a => a.id !== id));
  };

  const addCondition = () => {
    setBuilderConditions(prev => [
      ...prev,
      { id: crypto.randomUUID(), field: '', operator: 'equals', value: '' },
    ]);
  };

  const removeCondition = (id: string) => {
    setBuilderConditions(prev => prev.filter(c => c.id !== id));
  };

  // ── Metrics Row ──
  const MetricsRow = () => {
    if (!metrics) return null;
    const cards = [
      { label: 'Runs Today', value: String(metrics.runs_today), trend: metrics.runs_today_trend, icon: Activity, up: true },
      { label: 'Success Rate', value: `${metrics.success_rate}%`, trend: metrics.success_rate_trend, icon: CheckCircle2, up: true },
      { label: 'Avg Time', value: `${(metrics.avg_execution_ms / 1000).toFixed(1)}s`, trend: 0, icon: Timer, up: false },
      { label: 'Active', value: `${metrics.active_count} / ${metrics.total_count}`, trend: 0, icon: Zap, up: true },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#E8E8E4] rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-xs text-[#6B6B63] mb-1">
              <card.icon className="w-3.5 h-3.5" />
              {card.label}
            </div>
            <div className="font-[Georgia,serif] text-xl sm:text-2xl text-[#1A1A1A]">{card.value}</div>
            {card.trend > 0 && (
              <div className={`text-xs mt-1 ${card.up ? 'text-[#00875A]' : 'text-[#DC2626]'}`}>
                {card.up ? '\u25B2' : '\u25BC'} +{card.trend}%
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // ── Tabs ──
  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'active', label: 'Active Workflows', count: workflows.length },
    { id: 'templates', label: 'Templates', count: WORKFLOW_TEMPLATES.length },
    { id: 'executions', label: 'Execution Log', count: executions.length },
  ];

  if (loading) {
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
            Workflow Automation
          </h1>
          <p className="text-sm text-[#6B6B63] mt-1">
            Configure triggers, conditions, and automated actions
          </p>
        </div>
        <button
          onClick={() => openBuilder()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00875A] text-white text-sm font-medium rounded-lg hover:bg-[#006D48] transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <MetricsRow />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E8E8E4] mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 min-h-[44px] ${
              activeTab === tab.id
                ? 'border-[#00875A] text-[#00875A]'
                : 'border-transparent text-[#6B6B63] hover:text-[#1A1A1A]'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs bg-[#F5F5F0] px-1.5 py-0.5 rounded">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {workflows.length === 0 ? (
              <EmptyState
                onCreateNew={() => openBuilder()}
                onViewTemplates={() => setActiveTab('templates')}
              />
            ) : (
              <div className="space-y-3">
                {workflows.map((wf) => (
                  <WorkflowCard
                    key={wf.id}
                    workflow={wf}
                    onToggle={() => handleToggle(wf.id, wf.status)}
                    onEdit={() => openBuilder(wf)}
                    onDelete={() => handleDelete(wf.id)}
                    onRun={() => handleRun(wf.id)}
                    onDryRun={() => handleRun(wf.id, true)}
                    isRunning={runningId === wf.id}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WORKFLOW_TEMPLATES.map((tmpl, idx) => (
                <TemplateCard
                  key={idx}
                  template={tmpl}
                  onInstall={() => handleInstallTemplate(idx)}
                  alreadyInstalled={workflows.some(w => w.name === tmpl.name)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'executions' && (
          <motion.div
            key="executions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {executions.length === 0 ? (
              <div className="text-center py-12 text-sm text-[#6B6B63]">
                <Clock className="w-8 h-8 mx-auto mb-3 text-[#9CA39B]" />
                No executions yet. Run a workflow to see results here.
              </div>
            ) : (
              <div className="space-y-2">
                {executions.map((exec) => (
                  <ExecutionRow key={exec.id} execution={exec} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <WorkflowBuilder
            name={builderName}
            setName={setBuilderName}
            description={builderDescription}
            setDescription={setBuilderDescription}
            trigger={builderTrigger}
            setTrigger={setBuilderTrigger}
            conditions={builderConditions}
            addCondition={addCondition}
            removeCondition={removeCondition}
            setConditions={setBuilderConditions}
            actions={builderActions}
            addAction={addAction}
            removeAction={removeAction}
            setActions={setBuilderActions}
            onSave={handleSaveWorkflow}
            onCancel={closeBuilder}
            saving={saving}
            isEditing={!!editingWorkflow}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ──

function WorkflowCard({
  workflow, onToggle, onEdit, onDelete, onRun, onDryRun, isRunning,
}: {
  workflow: Workflow;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRun: () => void;
  onDryRun: () => void;
  isRunning: boolean;
}) {
  const totalRuns = workflow.success_count + workflow.fail_count;
  const successRate = totalRuns > 0 ? Math.round((workflow.success_count / totalRuns) * 100) : 0;

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg p-4 hover:border-[#C8C8C4] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-[Georgia,serif] text-base font-semibold text-[#1A1A1A] truncate">
              {workflow.name}
            </h3>
            <StatusBadge status={workflow.status} />
          </div>
          <p className="text-xs text-[#6B6B63] truncate">{workflow.description}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#9CA39B]">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {TRIGGER_LABELS[workflow.trigger.type]}
            </span>
            <span>{workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}</span>
            {workflow.last_run_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(workflow.last_run_at)}
              </span>
            )}
            {totalRuns > 0 && (
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {successRate}% ({totalRuns} runs)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#00875A] text-white rounded hover:bg-[#006D48] disabled:opacity-50 min-h-[36px] transition-colors"
            title="Run Now"
          >
            {isRunning ? (
              <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            Run
          </button>
          <button
            onClick={onDryRun}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#6B6B63] bg-[#F5F5F0] rounded hover:bg-[#E8E8E4] disabled:opacity-50 min-h-[36px] transition-colors"
            title="Dry Run"
          >
            <RotateCcw className="w-3 h-3" />
            Dry
          </button>
          <button
            onClick={onToggle}
            className={`p-2 rounded min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors ${
              workflow.status === 'enabled'
                ? 'text-[#00875A] bg-green-50 hover:bg-green-100'
                : 'text-[#9CA39B] bg-[#F5F5F0] hover:bg-[#E8E8E4]'
            }`}
            title={workflow.status === 'enabled' ? 'Disable' : 'Enable'}
          >
            {workflow.status === 'enabled' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-[#6B6B63] bg-[#F5F5F0] rounded hover:bg-[#E8E8E4] min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
            title="Edit"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 bg-red-50 rounded hover:bg-red-100 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    enabled: { bg: 'bg-green-50', text: 'text-[#00875A]', dot: 'bg-[#00875A]' },
    disabled: { bg: 'bg-gray-100', text: 'text-[#6B6B63]', dot: 'bg-[#9CA39B]' },
    error: { bg: 'bg-red-50', text: 'text-[#DC2626]', dot: 'bg-[#DC2626]' },
  };
  const c = config[status] || config.disabled;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TemplateCard({
  template, onInstall, alreadyInstalled,
}: {
  template: typeof WORKFLOW_TEMPLATES[0];
  onInstall: () => void;
  alreadyInstalled: boolean;
}) {
  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg p-4 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#00875A]/10 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-[#00875A]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-[Georgia,serif] text-sm font-semibold text-[#1A1A1A]">{template.name}</h3>
          <p className="text-xs text-[#6B6B63] mt-0.5 line-clamp-2">{template.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded-full">
          {TRIGGER_LABELS[template.trigger.type]}
        </span>
        {template.actions.map((a, i) => (
          <span key={i} className="px-2 py-0.5 text-[10px] bg-[#F5F5F0] text-[#6B6B63] rounded-full">
            {ACTION_LABELS[a.type]}
          </span>
        ))}
      </div>
      <div className="mt-auto">
        <button
          onClick={onInstall}
          disabled={alreadyInstalled}
          className={`w-full py-2 text-xs font-medium rounded-lg min-h-[40px] transition-colors ${
            alreadyInstalled
              ? 'bg-[#F5F5F0] text-[#9CA39B] cursor-not-allowed'
              : 'bg-[#00875A] text-white hover:bg-[#006D48]'
          }`}
        >
          {alreadyInstalled ? 'Already Installed' : 'Install Template'}
        </button>
      </div>
    </div>
  );
}

function ExecutionRow({ execution }: { execution: WorkflowExecution }) {
  const [expanded, setExpanded] = useState(false);
  const statusIcon = {
    success: <CheckCircle2 className="w-4 h-4 text-[#00875A]" />,
    failed: <XCircle className="w-4 h-4 text-[#DC2626]" />,
    skipped: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  }[execution.status];

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#FAFAF8] transition-colors min-h-[48px]"
      >
        {statusIcon}
        <span className="flex-1 text-sm text-[#1A1A1A] font-medium truncate">
          {execution.workflow_name}
        </span>
        {execution.is_dry_run && (
          <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 rounded-full">DRY RUN</span>
        )}
        <span className="text-xs text-[#9CA39B] shrink-0">{(execution.duration_ms / 1000).toFixed(1)}s</span>
        <span className="text-xs text-[#9CA39B] shrink-0">{formatTimeAgo(execution.created_at)}</span>
        <ChevronRight className={`w-4 h-4 text-[#9CA39B] transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 border-t border-[#E8E8E4]">
          <div className="pt-2 space-y-1.5">
            {execution.action_results.map((ar, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {ar.success ? (
                  <CheckCircle2 className="w-3 h-3 text-[#00875A]" />
                ) : (
                  <XCircle className="w-3 h-3 text-[#DC2626]" />
                )}
                <span className="text-[#6B6B63]">{ar.detail}</span>
              </div>
            ))}
            {execution.error_message && (
              <div className="text-xs text-[#DC2626] bg-red-50 p-2 rounded mt-2">
                {execution.error_message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({
  onCreateNew, onViewTemplates,
}: {
  onCreateNew: () => void;
  onViewTemplates: () => void;
}) {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="w-14 h-14 bg-[#F5F5F0] border border-[#E8E8E4] rounded-xl flex items-center justify-center mx-auto mb-4">
        <WorkflowIcon className="w-6 h-6 text-[#6B6B63]" />
      </div>
      <h3 className="font-[Georgia,serif] text-lg font-semibold text-[#1A1A1A] mb-1.5">No workflows yet</h3>
      <p className="text-sm text-[#6B6B63] mb-6 max-w-md mx-auto">
        Create automated workflows that connect wizard outputs to ongoing operations.
        Start with a template or build from scratch.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onViewTemplates}
          className="px-5 py-2.5 bg-[#F5F5F0] text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E8E8E4] transition-colors min-h-[44px]"
        >
          Browse Templates
        </button>
        <button
          onClick={onCreateNew}
          className="px-5 py-2.5 bg-[#00875A] text-white text-sm font-medium rounded-lg hover:bg-[#006D48] transition-colors min-h-[44px]"
        >
          Build Custom Workflow
        </button>
      </div>
    </div>
  );
}

// ── Workflow Builder Modal ──
function WorkflowBuilder({
  name, setName, description, setDescription,
  trigger, setTrigger,
  conditions, addCondition, removeCondition, setConditions,
  actions, addAction, removeAction, setActions,
  onSave, onCancel, saving, isEditing,
}: {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  trigger: WorkflowTrigger; setTrigger: (v: WorkflowTrigger) => void;
  conditions: WorkflowCondition[]; addCondition: () => void;
  removeCondition: (id: string) => void;
  setConditions: (v: WorkflowCondition[]) => void;
  actions: WorkflowAction[]; addAction: () => void;
  removeAction: (id: string) => void;
  setActions: (v: WorkflowAction[]) => void;
  onSave: () => void; onCancel: () => void;
  saving: boolean; isEditing: boolean;
}) {
  const triggerTypes: TriggerType[] = [
    'wizard_completed', 'deal_stage_changed', 'milestone_approaching', 'cron_schedule', 'manual_trigger',
  ];
  const actionTypes: ActionType[] = [
    'create_project', 'create_deal', 'send_notification', 'log_activity', 'generate_document', 'update_record',
  ];

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
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8E8E4]">
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#1A1A1A]">
            {isEditing ? 'Edit Workflow' : 'New Workflow'}
          </h2>
          <button onClick={onCancel} className="p-2 text-[#6B6B63] hover:text-[#1A1A1A] min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Name & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Workflow Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Wizard Complete \u2192 Project Setup"
                className="w-full px-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] min-h-[40px]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B63] mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="What does this workflow automate?"
                className="w-full px-3 py-2 border border-[#E8E8E4] rounded-lg text-sm focus:outline-none focus:border-[#00875A] resize-none"
              />
            </div>
          </div>

          {/* Trigger */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
              <Zap className="w-3.5 h-3.5" />
              TRIGGER
            </div>
            <select
              value={trigger.type}
              onChange={(e) => setTrigger({ ...trigger, type: e.target.value as TriggerType })}
              className="w-full px-3 py-2 border border-blue-200 rounded text-sm bg-white focus:outline-none min-h-[40px]"
            >
              {triggerTypes.map(t => (
                <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>
              ))}
            </select>
            {trigger.type === 'cron_schedule' && (
              <input
                value={trigger.cron_expression || ''}
                onChange={(e) => setTrigger({ ...trigger, cron_expression: e.target.value })}
                placeholder="0 9 * * * (cron expression)"
                className="w-full mt-2 px-3 py-2 border border-blue-200 rounded text-sm bg-white focus:outline-none min-h-[40px]"
              />
            )}
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                CONDITIONS (optional)
              </span>
              <button onClick={addCondition} className="text-xs text-[#00875A] hover:underline">
                + Add Condition
              </button>
            </div>
            {conditions.map((cond, i) => (
              <div key={cond.id} className="flex items-center gap-2 mb-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                <input
                  value={cond.field}
                  onChange={(e) => {
                    const updated = [...conditions];
                    updated[i] = { ...cond, field: e.target.value };
                    setConditions(updated);
                  }}
                  placeholder="Field"
                  className="flex-1 px-2 py-1.5 border border-amber-200 rounded text-xs bg-white min-h-[32px]"
                />
                <select
                  value={cond.operator}
                  onChange={(e) => {
                    const updated = [...conditions];
                    updated[i] = { ...cond, operator: e.target.value as any };
                    setConditions(updated);
                  }}
                  className="px-2 py-1.5 border border-amber-200 rounded text-xs bg-white min-h-[32px]"
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="greater_than">greater than</option>
                  <option value="is_not_null">is not null</option>
                </select>
                <input
                  value={cond.value}
                  onChange={(e) => {
                    const updated = [...conditions];
                    updated[i] = { ...cond, value: e.target.value };
                    setConditions(updated);
                  }}
                  placeholder="Value"
                  className="flex-1 px-2 py-1.5 border border-amber-200 rounded text-xs bg-white min-h-[32px]"
                />
                <button
                  onClick={() => removeCondition(cond.id)}
                  className="p-1 text-amber-600 hover:text-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#00875A] flex items-center gap-1">
                <Play className="w-3.5 h-3.5" />
                ACTIONS
              </span>
              <button onClick={addAction} className="text-xs text-[#00875A] hover:underline">
                + Add Action
              </button>
            </div>
            {actions.length === 0 && (
              <p className="text-xs text-[#9CA39B] italic">No actions yet. Add at least one action.</p>
            )}
            {actions.map((action, i) => (
              <div key={action.id} className="flex items-center gap-2 mb-2 bg-green-50 border border-green-200 rounded-lg p-2.5">
                <span className="text-xs text-green-700 font-mono shrink-0">{i + 1}.</span>
                <select
                  value={action.type}
                  onChange={(e) => {
                    const updated = [...actions];
                    updated[i] = { ...action, type: e.target.value as ActionType };
                    setActions(updated);
                  }}
                  className="flex-1 px-2 py-1.5 border border-green-200 rounded text-xs bg-white min-h-[32px]"
                >
                  {actionTypes.map(t => (
                    <option key={t} value={t}>{ACTION_LABELS[t]}</option>
                  ))}
                </select>
                <input
                  value={action.target}
                  onChange={(e) => {
                    const updated = [...actions];
                    updated[i] = { ...action, target: e.target.value };
                    setActions(updated);
                  }}
                  placeholder="Target table"
                  className="flex-1 px-2 py-1.5 border border-green-200 rounded text-xs bg-white min-h-[32px]"
                />
                <button
                  onClick={() => removeAction(action.id)}
                  className="p-1 text-green-600 hover:text-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-[#E8E8E4]">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-[#6B6B63] hover:text-[#1A1A1A] min-h-[40px]"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !name.trim()}
            className="px-5 py-2 text-sm font-medium bg-[#00875A] text-white rounded-lg hover:bg-[#006D48] disabled:opacity-50 min-h-[40px] transition-colors"
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create & Enable'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Utility ──
function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
