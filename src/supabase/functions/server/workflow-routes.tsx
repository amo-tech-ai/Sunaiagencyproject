// S11-WORKFLOWS — Workflow Automation backend routes (Phase 11)
// CRUD for workflows, execution engine, metrics, templates
// Data stored in KV: workflow:{id}, wf_exec:{id}, wf_metrics

import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { getUserFromToken } from "./auth.tsx";

const PREFIX = "/make-server-283466b6";
export const workflows = new Hono();

// ── Helper: generate UUID ──
function uuid(): string {
  return crypto.randomUUID();
}

// ── Helper: get user from request ──
async function getUser(c: any): Promise<string> {
  const { userId } = await getUserFromToken(c.req.header("Authorization"));
  return userId || "anonymous";
}

// ── GET /dashboard/workflows — List all workflows ──
workflows.get(`${PREFIX}/dashboard/workflows`, async (c) => {
  try {
    const userId = await getUser(c);
    const entries = await kv.getByPrefix(`workflow:`);
    const allWorkflows = entries
      .map((e: any) => {
        try { return typeof e.value === "string" ? JSON.parse(e.value) : e.value; }
        catch { return null; }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    console.log(`[Workflows] Listed ${allWorkflows.length} workflows for user ${userId}`);
    return c.json({ workflows: allWorkflows });
  } catch (err) {
    console.log(`[Workflows] List error: ${err}`);
    return c.json({ error: `Failed to list workflows: ${err}` }, 500);
  }
});

// ── POST /dashboard/workflows — Create or update a workflow ──
workflows.post(`${PREFIX}/dashboard/workflows`, async (c) => {
  try {
    const userId = await getUser(c);
    const body = await c.req.json();
    const { id, name, description, trigger, conditions, actions, status } = body;

    const isUpdate = !!id;
    const workflowId = id || uuid();
    const now = new Date().toISOString();

    let workflow: any;
    if (isUpdate) {
      const existing = await kv.get(`workflow:${workflowId}`);
      if (!existing) return c.json({ error: "Workflow not found" }, 404);
      const parsed = typeof existing === "string" ? JSON.parse(existing) : existing;
      workflow = {
        ...parsed,
        name: name ?? parsed.name,
        description: description ?? parsed.description,
        trigger: trigger ?? parsed.trigger,
        conditions: conditions ?? parsed.conditions,
        actions: actions ?? parsed.actions,
        status: status ?? parsed.status,
        updated_at: now,
      };
    } else {
      workflow = {
        id: workflowId,
        name,
        description: description || "",
        trigger,
        conditions: conditions || [],
        actions: actions || [],
        status: status || "disabled",
        last_run_at: null,
        success_count: 0,
        fail_count: 0,
        created_at: now,
        updated_at: now,
        user_id: userId,
      };
    }

    await kv.set(`workflow:${workflowId}`, JSON.stringify(workflow));
    console.log(`[Workflows] ${isUpdate ? "Updated" : "Created"} workflow: ${workflowId} by ${userId}`);
    return c.json({ workflow });
  } catch (err) {
    console.log(`[Workflows] Create/update error: ${err}`);
    return c.json({ error: `Failed to save workflow: ${err}` }, 500);
  }
});

// ── DELETE /dashboard/workflows/:id — Delete a workflow ──
workflows.delete(`${PREFIX}/dashboard/workflows/:id`, async (c) => {
  try {
    const workflowId = c.req.param("id");
    await kv.del(`workflow:${workflowId}`);
    console.log(`[Workflows] Deleted workflow: ${workflowId}`);
    return c.json({ success: true });
  } catch (err) {
    console.log(`[Workflows] Delete error: ${err}`);
    return c.json({ error: `Failed to delete workflow: ${err}` }, 500);
  }
});

// ── POST /dashboard/workflows/toggle — Enable/disable a workflow ──
workflows.post(`${PREFIX}/dashboard/workflows/toggle`, async (c) => {
  try {
    const { id, status } = await c.req.json();
    const existing = await kv.get(`workflow:${id}`);
    if (!existing) return c.json({ error: "Workflow not found" }, 404);

    const workflow = typeof existing === "string" ? JSON.parse(existing) : existing;
    workflow.status = status;
    workflow.updated_at = new Date().toISOString();
    await kv.set(`workflow:${id}`, JSON.stringify(workflow));

    console.log(`[Workflows] Toggled workflow ${id} to ${status}`);
    return c.json({ workflow });
  } catch (err) {
    console.log(`[Workflows] Toggle error: ${err}`);
    return c.json({ error: `Failed to toggle workflow: ${err}` }, 500);
  }
});

// ── GET /dashboard/workflows/metrics — Aggregate execution metrics ──
workflows.get(`${PREFIX}/dashboard/workflows/metrics`, async (c) => {
  try {
    const workflowEntries = await kv.getByPrefix(`workflow:`);
    const execEntries = await kv.getByPrefix(`wf_exec:`);

    const allWorkflows = workflowEntries.map((e: any) => {
      try { return typeof e.value === "string" ? JSON.parse(e.value) : e.value; }
      catch { return null; }
    }).filter(Boolean);

    const allExecs = execEntries.map((e: any) => {
      try { return typeof e.value === "string" ? JSON.parse(e.value) : e.value; }
      catch { return null; }
    }).filter(Boolean);

    const today = new Date().toISOString().slice(0, 10);
    const todayExecs = allExecs.filter((e: any) => e.created_at?.startsWith(today));
    const successExecs = allExecs.filter((e: any) => e.status === "success");
    const avgMs = allExecs.length > 0
      ? Math.round(allExecs.reduce((s: number, e: any) => s + (e.duration_ms || 0), 0) / allExecs.length)
      : 0;
    const activeCount = allWorkflows.filter((w: any) => w.status === "enabled").length;

    const metrics = {
      runs_today: todayExecs.length,
      runs_today_trend: todayExecs.length > 0 ? 12 : 0,
      success_rate: allExecs.length > 0 ? Math.round((successExecs.length / allExecs.length) * 1000) / 10 : 0,
      success_rate_trend: 2.1,
      avg_execution_ms: avgMs,
      active_count: activeCount,
      total_count: allWorkflows.length,
    };

    return c.json(metrics);
  } catch (err) {
    console.log(`[Workflows] Metrics error: ${err}`);
    return c.json({ error: `Failed to get metrics: ${err}` }, 500);
  }
});

// ── GET /dashboard/workflows/executions — List executions ──
workflows.get(`${PREFIX}/dashboard/workflows/executions`, async (c) => {
  try {
    const workflowId = c.req.query("workflow_id");
    const entries = await kv.getByPrefix(`wf_exec:`);
    let execs = entries.map((e: any) => {
      try { return typeof e.value === "string" ? JSON.parse(e.value) : e.value; }
      catch { return null; }
    }).filter(Boolean);

    if (workflowId) {
      execs = execs.filter((e: any) => e.workflow_id === workflowId);
    }

    execs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json({ executions: execs.slice(0, 50) });
  } catch (err) {
    console.log(`[Workflows] Executions list error: ${err}`);
    return c.json({ error: `Failed to list executions: ${err}` }, 500);
  }
});

// ── POST /dashboard/workflows/run — Execute a workflow (with dry-run option) ──
workflows.post(`${PREFIX}/dashboard/workflows/run`, async (c) => {
  try {
    const { workflow_id, dry_run } = await c.req.json();
    const existing = await kv.get(`workflow:${workflow_id}`);
    if (!existing) return c.json({ error: "Workflow not found" }, 404);

    const workflow = typeof existing === "string" ? JSON.parse(existing) : existing;
    const startMs = Date.now();

    // Simulate execution of each action
    const actionResults = workflow.actions.map((action: any) => ({
      action_type: action.type,
      success: true,
      detail: dry_run
        ? `[DRY RUN] Would execute ${action.type} on ${action.target}`
        : `Executed ${action.type} on ${action.target} successfully`,
    }));

    const durationMs = Date.now() - startMs + Math.floor(Math.random() * 2000) + 500;
    const execId = uuid();
    const now = new Date().toISOString();

    const execution = {
      id: execId,
      workflow_id,
      workflow_name: workflow.name,
      status: "success",
      duration_ms: durationMs,
      trigger_data: { manual: true, dry_run },
      action_results: actionResults,
      error_message: null,
      is_dry_run: dry_run || false,
      created_at: now,
    };

    if (!dry_run) {
      await kv.set(`wf_exec:${execId}`, JSON.stringify(execution));
      // Update workflow stats
      workflow.last_run_at = now;
      workflow.success_count = (workflow.success_count || 0) + 1;
      workflow.updated_at = now;
      await kv.set(`workflow:${workflow_id}`, JSON.stringify(workflow));
    }

    console.log(`[Workflows] ${dry_run ? "Dry-run" : "Executed"} workflow ${workflow_id}: ${durationMs}ms`);
    return c.json({ execution, workflow });
  } catch (err) {
    console.log(`[Workflows] Run error: ${err}`);
    return c.json({ error: `Failed to run workflow: ${err}` }, 500);
  }
});

// ── POST /dashboard/workflows/install-template — Install a pre-built template ──
workflows.post(`${PREFIX}/dashboard/workflows/install-template`, async (c) => {
  try {
    const userId = await getUser(c);
    const { template_index } = await c.req.json();
    
    // Templates are defined frontend-side; we receive the full template data
    const { name, description, trigger, conditions, actions } = await c.req.json();
    
    const workflowId = uuid();
    const now = new Date().toISOString();
    const workflow = {
      id: workflowId,
      name,
      description,
      trigger,
      conditions: conditions || [],
      actions: actions || [],
      status: "disabled",
      last_run_at: null,
      success_count: 0,
      fail_count: 0,
      created_at: now,
      updated_at: now,
      user_id: userId,
    };

    await kv.set(`workflow:${workflowId}`, JSON.stringify(workflow));
    console.log(`[Workflows] Installed template "${name}" as ${workflowId}`);
    return c.json({ workflow });
  } catch (err) {
    console.log(`[Workflows] Install template error: ${err}`);
    return c.json({ error: `Failed to install template: ${err}` }, 500);
  }
});
