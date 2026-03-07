// S06-CRM — Client Management CRUD routes
// Reads/writes to `clients` and `crm_contacts` Supabase tables (no KV store)
// Requires auth for all routes. Uses adminClient for service-level access.

import { Hono } from "npm:hono";
import { adminClient } from "./db.tsx";
import { requireAuth } from "./auth.tsx";

const crm = new Hono();
const PREFIX = "/make-server-283466b6";

// ── GET /crm/clients — List all clients ──
crm.get(`${PREFIX}/crm/clients`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    await requireAuth(authHeader ?? null);

    const db = adminClient();
    const { data: clients, error } = await db
      .from("clients")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.log(`[CRM] List clients error: ${error.message}`);
      return c.json({ error: `Failed to list clients: ${error.message}` }, 500);
    }

    console.log(`[CRM] Listed ${clients?.length || 0} clients`);
    return c.json({ clients: clients || [] });
  } catch (error) {
    console.log(`[CRM] List clients exception: ${error}`);
    return c.json({ error: `List clients failed: ${error}` }, 401);
  }
});

// ── GET /crm/clients/:id — Get single client with contacts ──
crm.get(`${PREFIX}/crm/clients/:id`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    await requireAuth(authHeader ?? null);

    const id = c.req.param("id");
    const db = adminClient();

    const [clientRes, contactsRes] = await Promise.all([
      db.from("clients").select("*").eq("id", id).maybeSingle(),
      db.from("crm_contacts").select("*").eq("client_id", id).order("is_primary", { ascending: false }),
    ]);

    if (clientRes.error) {
      console.log(`[CRM] Get client error: ${clientRes.error.message}`);
      return c.json({ error: `Failed to get client: ${clientRes.error.message}` }, 500);
    }

    if (!clientRes.data) {
      return c.json({ error: `Client ${id} not found` }, 404);
    }

    return c.json({
      client: clientRes.data,
      contacts: contactsRes.data || [],
    });
  } catch (error) {
    console.log(`[CRM] Get client exception: ${error}`);
    return c.json({ error: `Get client failed: ${error}` }, 401);
  }
});

// ── POST /crm/clients — Create a new client ──
crm.post(`${PREFIX}/crm/clients`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const userId = await requireAuth(authHeader ?? null);

    const body = await c.req.json();
    const { name, industry, status, health_score, contact_email, contact_name, revenue, notes } = body;

    if (!name) {
      return c.json({ error: "Client name is required" }, 400);
    }

    const db = adminClient();
    const { data: client, error } = await db
      .from("clients")
      .insert({
        name,
        industry: industry || "",
        status: status || "prospect",
        health_score: health_score || 50,
        contact_email: contact_email || "",
        contact_name: contact_name || "",
        revenue: revenue || 0,
        notes: notes || "",
        created_by: userId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.log(`[CRM] Create client error: ${error.message}`);
      return c.json({ error: `Failed to create client: ${error.message}` }, 500);
    }

    console.log(`[CRM] Created client: ${client.id} (${name})`);
    return c.json({ client }, 201);
  } catch (error) {
    console.log(`[CRM] Create client exception: ${error}`);
    return c.json({ error: `Create client failed: ${error}` }, 401);
  }
});

// ── PUT /crm/clients/:id — Update a client ──
crm.put(`${PREFIX}/crm/clients/:id`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    await requireAuth(authHeader ?? null);

    const id = c.req.param("id");
    const body = await c.req.json();

    // Only update fields that are provided
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const allowedFields = ["name", "industry", "status", "health_score", "contact_email", "contact_name", "revenue", "notes"];
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    const db = adminClient();
    const { data: client, error } = await db
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log(`[CRM] Update client error: ${error.message}`);
      return c.json({ error: `Failed to update client: ${error.message}` }, 500);
    }

    console.log(`[CRM] Updated client: ${id}`);
    return c.json({ client });
  } catch (error) {
    console.log(`[CRM] Update client exception: ${error}`);
    return c.json({ error: `Update client failed: ${error}` }, 401);
  }
});

// ── DELETE /crm/clients/:id — Delete a client ──
crm.delete(`${PREFIX}/crm/clients/:id`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    await requireAuth(authHeader ?? null);

    const id = c.req.param("id");
    const db = adminClient();

    // Delete contacts first (cascade)
    await db.from("crm_contacts").delete().eq("client_id", id);

    const { error } = await db.from("clients").delete().eq("id", id);

    if (error) {
      console.log(`[CRM] Delete client error: ${error.message}`);
      return c.json({ error: `Failed to delete client: ${error.message}` }, 500);
    }

    console.log(`[CRM] Deleted client: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`[CRM] Delete client exception: ${error}`);
    return c.json({ error: `Delete client failed: ${error}` }, 401);
  }
});

// ── POST /crm/clients/:id/contacts — Add a contact to a client ──
crm.post(`${PREFIX}/crm/clients/:id/contacts`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    await requireAuth(authHeader ?? null);

    const clientId = c.req.param("id");
    const body = await c.req.json();
    const { name, email, role, phone, is_primary } = body;

    if (!name) {
      return c.json({ error: "Contact name is required" }, 400);
    }

    const db = adminClient();
    const { data: contact, error } = await db
      .from("crm_contacts")
      .insert({
        client_id: clientId,
        name,
        email: email || "",
        role: role || "",
        phone: phone || "",
        is_primary: is_primary || false,
      })
      .select()
      .single();

    if (error) {
      console.log(`[CRM] Create contact error: ${error.message}`);
      return c.json({ error: `Failed to create contact: ${error.message}` }, 500);
    }

    console.log(`[CRM] Created contact for client ${clientId}: ${contact.id}`);
    return c.json({ contact }, 201);
  } catch (error) {
    console.log(`[CRM] Create contact exception: ${error}`);
    return c.json({ error: `Create contact failed: ${error}` }, 401);
  }
});

export { crm };
