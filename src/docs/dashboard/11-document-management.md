# 11 — DOCUMENT MANAGEMENT DASHBOARD
# Proposals, Reports, Deliverables, File Organization, Version Tracking

**Component:** `DocumentManagementPage`
**File:** `/components/dashboard/documents/DocumentManagementPage.tsx`
**Route:** `/app/documents`
**ID:** 032-document-management-dashboard
**Diagram ID:** DASH-08
**Status:** NOT STARTED
**Priority:** P2
**Effort:** M (Medium)
**Parent Doc:** `00-dashboard-master.md`
**Depends On:** ProjectDelivery (027), Auth, documents, projects, deliverables, clients, organizations, Supabase Storage

---

## SCREEN PURPOSE

Central repository for all project documents — proposals generated from wizard data, contracts, deliverables, reports, and shared files. Organized by project with folder tree navigation, grid/list view toggle, drag-and-drop upload, version tracking, inline preview, and shareable links. Auto-generated documents from wizard data appear automatically. Replaces scattered email attachments and external file shares.

Real-world: "The 'Acme Retail' project folder contains: auto-generated proposal PDF from wizard Steps 1-3, roadmap PDF from Step 5, signed contract uploaded by the consultant, Phase 1 deliverable uploaded last week, weekly status report auto-generated from project data."

---

## TARGET USERS

- Business owners accessing project documents to review proposals and download deliverables
- Consultants uploading deliverables, managing versions, and sharing files
- Agency owners monitoring document completeness across all projects

---

## CORE FEATURES

1. **Document grid/list view** — Toggle between thumbnail grid and sortable table. Grid: icon, name (2 lines), category badge, date, size. List: full metadata columns.
2. **Project folder tree** — Left sidebar with client/project hierarchy and document count badges. Click to filter.
3. **Document categories** — 5 categories with color-coded badges: Proposals (blue #3B82F6), Contracts (purple #8B5CF6), Deliverables (lime #00875A), Reports (amber #D97706), Analysis Exports (teal #14B8A6)
4. **Upload with drag-and-drop** — Drop zone overlay on drag, multi-file support, progress bars, auto-category suggestion
5. **Auto-generated documents** — Wizard completion auto-generates: Proposal PDF (Steps 1-3), Roadmap PDF (Step 5), Analysis Export (Step 4)
6. **Version history** — Upload new version increments version number, preserves all previous versions, restore capability
7. **Share link generation** — Time-limited public URL with optional password, configurable expiration (1h, 1d, 1w, 30d)
8. **Document search** — Real-time filtering by name, type, category, or project name

---

## ASCII WIREFRAME — Desktop (1440px)

```
┌─────────────┬───────────────────┬──────────────────────────────────────────┐
│  SIDEBAR    │  FOLDER TREE      │  MAIN CONTENT                            │
│  240px      │  200px            │                                          │
│             │                   │  Documents                               │
│  ☀ Sun AI   │  All Documents    │  ┌──────────────────┐ ┌──┬──┐           │
│             │                   │  │ 🔍 Search docs...│ │▦ │☰ │           │
│  ──────────│  ▾ Acme Retail    │  └──────────────────┘ └──┴──┘           │
│  ○ Dashboard│    ▸ AI Trans. (7)│                                          │
│  ○ Projects │                   │  [Proposals] [Contracts] [Deliverables]  │
│  ○ CRM      │  ▾ BrightPath   │  [Reports] [Analysis Exports]            │
│  ○ Insights │    ▸ Phase 1 (4) │                                          │
│  ● Documents│                   │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  ○ Financial│  ▾ TechFlow      │  │ 📄      │ │ 📄      │ │ 📄      │   │
│  ○ Settings │    ▸ Consult.(3) │  │AI Trans-│ │Roadmap  │ │Contract │   │
│             │                   │  │form Pro-│ │Q1 2026  │ │v2.pdf   │   │
│             │  #FAFAF8 bg       │  │posal.pdf│ │.pdf     │ │         │   │
│             │  Active: #00875A  │  │Proposals│ │Reports  │ │Contract │   │
│             │  left border      │  │ 2d ago  │ │ 1w ago  │ │ 2w ago  │   │
│             │                   │  │ 2.4 MB  │ │ 1.1 MB  │ │ 340 KB  │   │
│             │                   │  └─────────┘ └─────────┘ └─────────┘   │
│             │                   │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│             │                   │  │ 📄      │ │ 📊      │ │ 📄      │   │
│             │                   │  │Support  │ │Readiness│ │Weekly   │   │
│             │                   │  │Engine   │ │Export   │ │Status   │   │
│             │                   │  │Config.  │ │.xlsx    │ │.pdf     │   │
│             │                   │  │Deliver. │ │Exports  │ │Reports  │   │
│             │                   │  │ 3d ago  │ │ 1w ago  │ │ 5d ago  │   │
│             │                   │  └─────────┘ └─────────┘ └─────────┘   │
│             │                   │                                          │
│             │                   │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│             │                   │    Drop files here to upload        │   │
│             │                   │  │ or click to browse                   │
│             │                   │    PDF, DOCX, PNG, JPG, XLS        │   │
│             │                   │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│             │                   │  #E8E8E4 dashed border, 80px height    │
└─────────────┴───────────────────┴──────────────────────────────────────────┘
```

---

## DOCUMENT CARD SPEC (Grid View)

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │         📄             │ │  ← file type icon, 64px
│ │    (thumbnail area)    │ │     PDF=red, DOCX=blue,
│ └────────────────────────┘ │     PNG/JPG=preview thumb
│                            │
│ AI Transformation          │  ← Inter 14px, 2 lines max
│ Proposal.pdf               │
│ ┌──────────┐               │
│ │ Proposals│               │  ← category badge (blue bg)
│ └──────────┘               │
│ 2 days ago  │  2.4 MB      │  ← 12px #6B6B63
└────────────────────────────┘
  260px, #FFFFFF bg, #E8E8E4 border, 4px radius
  Hover: 2px #00875A left border, cursor pointer
```

---

## TYPESCRIPT INTERFACES

```ts
type DocumentCategory = 'proposals' | 'contracts' | 'deliverables' | 'reports' | 'exports';
type FileType = 'pdf' | 'docx' | 'png' | 'jpg' | 'xls' | 'xlsx' | 'txt' | 'csv' | 'other';

interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  file_type: FileType;
  url: string;
  project_id: string;
  project_name: string;
  uploaded_by: string;
  uploaded_by_name: string;
  version: number;
  parent_document_id: string | null;
  file_size: number;
  ai_summary: string | null;
  created_at: string;
}

interface ProjectFolder {
  project_id: string;
  project_name: string;
  client_id: string;
  client_name: string;
  document_count: number;
}

interface ShareLink {
  id: string;
  document_id: string;
  url: string;
  expires_at: string;
  password_protected: boolean;
  access_count: number;
}
```

---

## HOOKS

useDocuments(filters): documents[], loading, refetch()
useProjectFolders(): folders[], loading
useDocumentUpload(): upload(files, projectId, category), uploads[] (progress), isUploading
useDocumentVersions(documentId): versions[], restore(versionId)
useShareLink(): generate(documentId, expiresIn, password?)

---

## BACKEND WIRING

### Edge Function Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | /dashboard/documents/folders | List projects with document counts |
| POST | /dashboard/documents | List documents with filters |
| PUT | /dashboard/documents | Create document metadata record |
| DELETE | /dashboard/documents/:id | Delete document + storage file |
| POST | /dashboard/documents/versions | List versions of a document |
| POST | /dashboard/documents/versions/restore | Restore a previous version |
| POST | /dashboard/documents/share | Generate time-limited share link |
| POST | /dashboard/documents/generate | Auto-generate doc from wizard data |
| POST | /dashboard/documents/search | Full-text search |

### Auto-Generation Pipeline

On wizard completion: edge function reads Steps 1-3 ai_results for proposal, Step 5 for roadmap, Step 4 for analysis export. Compiles into PDF with agency brand template (Georgia headings, #1A1A1A / #00875A palette). Uploads to Supabase Storage, inserts document record. Documents appear in project folder automatically.

### Edge Cases

| Scenario | Handling |
|----------|----------|
| No documents for project | Empty state: "No documents yet. Upload files or complete the wizard." |
| Upload fails mid-way | Error per file, successful uploads kept, retry button per failure |
| Unsupported file for preview | Icon + metadata + download button, "Preview not available" |
| Version restore, file deleted | 404: "Original file no longer available in storage" |
| Share link expired | 403: "This link has expired" |
| Large file (>50MB) | Client-side validation: "Maximum size: 50MB" |
| Concurrent uploads (5+) | Queue 3 at a time, all progress bars visible |

---

## ACCEPTANCE CRITERIA

- Folder tree organizes documents by client/project with count badges
- Grid and list view with toggle
- 5 document categories with color-coded badges and filter buttons
- Drag-and-drop upload with progress, auto-category suggestion
- Auto-generated proposal, roadmap, and analysis export on wizard completion
- Version history with timeline, restore, download
- Document preview: inline PDF (iframe), images, text files
- Share link with expiration and optional password
- Search with real-time filtering
- Responsive: folder tree becomes dropdown on tablet, single-column cards on mobile
