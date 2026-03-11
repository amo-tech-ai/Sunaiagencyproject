// S08-DOCUMENTS — Document Management routes (Phase 8)
// Uses Supabase Storage for files + documents table for metadata
// Private bucket with signed URLs for access control
// Auth via getUserFromToken (allows anonymous browse, auth for upload/delete)

import { Hono } from "npm:hono";
import { adminClient } from "./db.tsx";
import { getUserFromToken } from "./auth.tsx";

const documents = new Hono();
const PREFIX = "/make-server-283466b6";
const BUCKET_NAME = "make-283466b6-documents";

// ── Ensure bucket exists (idempotent) ──
let bucketReady = false;
async function ensureBucket() {
  if (bucketReady) return;
  try {
    const db = adminClient();
    const { data: buckets } = await db.storage.listBuckets();
    const exists = buckets?.some(
      (b: any) => b.name === BUCKET_NAME
    );
    if (!exists) {
      const { error } = await db.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      if (error) {
        console.log(`[Documents] Create bucket error: ${error.message}`);
      } else {
        console.log(`[Documents] Created bucket: ${BUCKET_NAME}`);
      }
    }
    bucketReady = true;
  } catch (err) {
    console.log(`[Documents] Ensure bucket error: ${err}`);
  }
}

function errorResponse(c: any, context: string, error: unknown) {
  const msg = String(error);
  const isAuthError =
    msg.includes("Authentication required") ||
    msg.includes("Auth validation error");
  const status = isAuthError ? 401 : 500;
  console.log(`[Documents] ${context} exception (${status}): ${msg}`);
  return c.json({ error: `${context}: ${msg}` }, status);
}

/** Generate a UUID-like ID */
function generateId(): string {
  return crypto.randomUUID();
}

/** Detect file type from name */
function detectFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    pdf: "pdf", docx: "docx", doc: "docx",
    png: "png", jpg: "jpg", jpeg: "jpg",
    xls: "xls", xlsx: "xlsx",
    txt: "txt", csv: "csv",
  };
  return map[ext] || "other";
}

/** Detect MIME type from extension */
function detectMimeType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    csv: "text/csv",
  };
  return map[ext] || "application/octet-stream";
}

/** Enrich a DB row with computed fields for frontend compatibility */
function enrichDoc(row: any) {
  return {
    ...row,
    file_type: detectFileType(row.name || ""),
  };
}

// ── GET /documents — List all documents ──
documents.get(`${PREFIX}/documents`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const { userId } = await getUserFromToken(authHeader ?? null);
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const db = adminClient();

    // Build query
    let query = db
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    // Optional filters from query params
    const category = c.req.query("category");
    const search = c.req.query("search")?.toLowerCase();

    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,category.ilike.%${search}%`
      );
    }

    const { data: docs, error } = await query;

    if (error) {
      console.log(`[Documents] List query error: ${error.message}`);
      return c.json({ error: `List failed: ${error.message}` }, 500);
    }

    const enriched = (docs || []).map(enrichDoc);

    console.log(
      `[Documents] Listed ${enriched.length} documents`
    );
    return c.json({ documents: enriched });
  } catch (error) {
    return errorResponse(c, "List documents failed", error);
  }
});

// ── GET /documents/stats — Get document statistics ──
// IMPORTANT: Must be registered BEFORE /documents/:id to avoid :id matching "stats"
documents.get(`${PREFIX}/documents/stats`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const { userId } = await getUserFromToken(authHeader ?? null);
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const db = adminClient();
    const { data: docs, error } = await db
      .from("documents")
      .select("*");

    if (error) {
      console.log(`[Documents] Stats query error: ${error.message}`);
      return c.json({ error: `Stats failed: ${error.message}` }, 500);
    }

    const rows = docs || [];

    const stats = {
      total: rows.length,
      totalSize: rows.reduce((sum: number, d: any) => sum + (d.file_size || 0), 0),
      byCategory: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      recentCount: 0,
    };

    const weekAgo = Date.now() - 7 * 86400000;
    for (const doc of rows) {
      const cat = doc.category || "uncategorized";
      const fileType = detectFileType(doc.name || "");
      stats.byCategory[cat] =
        (stats.byCategory[cat] || 0) + 1;
      stats.byType[fileType] =
        (stats.byType[fileType] || 0) + 1;
      if (new Date(doc.created_at).getTime() > weekAgo) {
        stats.recentCount++;
      }
    }

    return c.json({ stats });
  } catch (error) {
    return errorResponse(c, "Get document stats failed", error);
  }
});

// ── GET /documents/:id — Get single document with signed URL ──
documents.get(`${PREFIX}/documents/:id`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const { userId } = await getUserFromToken(authHeader ?? null);
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const id = c.req.param("id");
    const db = adminClient();
    const { data: doc, error } = await db
      .from("documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.log(`[Documents] Get query error: ${error.message}`);
      return c.json({ error: `Get failed: ${error.message}` }, 500);
    }

    if (!doc) {
      return c.json({ error: `Document ${id} not found` }, 404);
    }

    // Generate signed URL (1 hour expiry)
    await ensureBucket();
    const { data: signedData, error: signErr } = await db.storage
      .from(BUCKET_NAME)
      .createSignedUrl(doc.storage_path, 3600);

    if (signErr) {
      console.log(`[Documents] Signed URL error: ${signErr.message}`);
    }

    return c.json({
      document: {
        ...enrichDoc(doc),
        signed_url: signedData?.signedUrl || null,
      },
    });
  } catch (error) {
    return errorResponse(c, "Get document failed", error);
  }
});

// ── POST /documents/upload — Upload a file ──
// Accepts multipart form data: file + metadata fields
documents.post(`${PREFIX}/documents/upload`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const { userId } = await getUserFromToken(authHeader ?? null);
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    await ensureBucket();

    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || file?.name || "Untitled";
    const category = (formData.get("category") as string) || "deliverables";
    const projectId = (formData.get("project_id") as string) || null;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file size (50MB max)
    if (file.size > 52428800) {
      return c.json({ error: "File exceeds 50MB maximum size" }, 400);
    }

    const docId = generateId();
    const fileType = detectFileType(name);
    const mimeType = file.type || detectMimeType(name);
    const storagePath = `${userId === "anonymous" ? "shared" : userId}/${docId}/${name}`;

    // Upload to Supabase Storage
    const db = adminClient();
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await db.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.log(`[Documents] Upload error: ${uploadError.message}`);
      return c.json(
        { error: `Upload failed: ${uploadError.message}` },
        500
      );
    }

    // Save metadata to documents table
    const now = new Date().toISOString();
    const dbRow = {
      id: docId,
      name,
      category,
      storage_path: storagePath,
      project_id: projectId,
      uploaded_by: userId === "anonymous" ? null : userId,
      file_size: file.size,
      mime_type: mimeType,
      created_at: now,
      updated_at: now,
    };

    const { error: insertError } = await db
      .from("documents")
      .insert(dbRow);

    if (insertError) {
      console.log(`[Documents] Insert error: ${insertError.message}`);
      // Clean up the uploaded file since metadata save failed
      await db.storage.from(BUCKET_NAME).remove([storagePath]);
      return c.json(
        { error: `Save metadata failed: ${insertError.message}` },
        500
      );
    }

    // Generate signed URL for immediate use
    const { data: signedData } = await db.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, 3600);

    console.log(
      `[Documents] Uploaded: ${docId} (${name}, ${file.size} bytes, ${category})`
    );

    return c.json(
      {
        document: {
          ...enrichDoc(dbRow),
          signed_url: signedData?.signedUrl || null,
        },
      },
      201
    );
  } catch (error) {
    return errorResponse(c, "Upload document failed", error);
  }
});

// ── DELETE /documents/:id — Delete a document ──
documents.delete(`${PREFIX}/documents/:id`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const { userId } = await getUserFromToken(authHeader ?? null);
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const id = c.req.param("id");
    const db = adminClient();
    const { data: doc, error: fetchError } = await db
      .from("documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.log(`[Documents] Fetch for delete error: ${fetchError.message}`);
      return c.json({ error: `Fetch failed: ${fetchError.message}` }, 500);
    }

    if (!doc) {
      return c.json({ error: `Document ${id} not found` }, 404);
    }

    // Delete from storage
    await ensureBucket();
    const { error: storageErr } = await db.storage
      .from(BUCKET_NAME)
      .remove([doc.storage_path]);

    if (storageErr) {
      console.log(
        `[Documents] Storage delete error: ${storageErr.message}`
      );
    }

    // Delete metadata from documents table
    const { error: deleteError } = await db
      .from("documents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.log(`[Documents] Delete row error: ${deleteError.message}`);
      return c.json({ error: `Delete failed: ${deleteError.message}` }, 500);
    }

    console.log(`[Documents] Deleted: ${id} (${doc.name})`);
    return c.json({ success: true });
  } catch (error) {
    return errorResponse(c, "Delete document failed", error);
  }
});

// ── POST /documents/:id/share — Generate a share link ──
documents.post(`${PREFIX}/documents/:id/share`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const { userId } = await getUserFromToken(authHeader ?? null);
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const id = c.req.param("id");
    const db = adminClient();
    const { data: doc, error: fetchError } = await db
      .from("documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.log(`[Documents] Fetch for share error: ${fetchError.message}`);
      return c.json({ error: `Fetch failed: ${fetchError.message}` }, 500);
    }

    if (!doc) {
      return c.json({ error: `Document ${id} not found` }, 404);
    }

    // Parse expiration from body (default 1 day)
    let expiresIn = 86400; // 1 day in seconds
    try {
      const body = await c.req.json();
      if (body.expires_in) {
        const allowed = [3600, 86400, 604800, 2592000]; // 1h, 1d, 1w, 30d
        if (allowed.includes(body.expires_in)) {
          expiresIn = body.expires_in;
        }
      }
    } catch {
      // No body or invalid JSON — use defaults
    }

    await ensureBucket();
    const { data, error } = await db.storage
      .from(BUCKET_NAME)
      .createSignedUrl(doc.storage_path, expiresIn);

    if (error) {
      return c.json(
        { error: `Failed to create share link: ${error.message}` },
        500
      );
    }

    const expiresAt = new Date(
      Date.now() + expiresIn * 1000
    ).toISOString();

    console.log(
      `[Documents] Share link created for ${id}, expires: ${expiresAt}`
    );
    return c.json({
      share: {
        url: data.signedUrl,
        expires_at: expiresAt,
        document_id: id,
        document_name: doc.name,
      },
    });
  } catch (error) {
    return errorResponse(c, "Create share link failed", error);
  }
});

// ── PUT /documents/:id — Update document metadata ──
documents.put(`${PREFIX}/documents/:id`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const { userId } = await getUserFromToken(authHeader ?? null);
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const id = c.req.param("id");
    const db = adminClient();
    const { data: doc, error: fetchError } = await db
      .from("documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.log(`[Documents] Fetch for update error: ${fetchError.message}`);
      return c.json({ error: `Fetch failed: ${fetchError.message}` }, 500);
    }

    if (!doc) {
      return c.json({ error: `Document ${id} not found` }, 404);
    }

    const body = await c.req.json();

    // Map incoming fields to DB columns
    // Frontend may send ai_summary (old KV field) — map it to summary (DB column)
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name;
    if (body.category !== undefined) updates.category = body.category;
    if (body.project_id !== undefined) updates.project_id = body.project_id;
    if (body.summary !== undefined) updates.summary = body.summary;
    if (body.ai_summary !== undefined) updates.summary = body.ai_summary;

    const { data: updatedDoc, error: updateError } = await db
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.log(`[Documents] Update error: ${updateError.message}`);
      return c.json({ error: `Update failed: ${updateError.message}` }, 500);
    }

    console.log(`[Documents] Updated metadata: ${id}`);
    return c.json({ document: enrichDoc(updatedDoc) });
  } catch (error) {
    return errorResponse(c, "Update document failed", error);
  }
});

export { documents };
