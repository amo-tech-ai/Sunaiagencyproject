// T-DOCUMENTS — Document management TypeScript interfaces
// Used by DocumentManagementPage and document-routes edge functions

export type DocumentCategory = 'proposals' | 'contracts' | 'deliverables' | 'reports' | 'exports';
export type FileType = 'pdf' | 'docx' | 'png' | 'jpg' | 'xls' | 'xlsx' | 'txt' | 'csv' | 'other';

export interface DocumentMeta {
  id: string;
  name: string;
  category: DocumentCategory;
  file_type: FileType;
  storage_path: string;
  project_id: string | null;
  project_name: string | null;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  version: number;
  file_size: number;
  mime_type: string;
  ai_summary: string | null;
  signed_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentUploadInput {
  name: string;
  category: DocumentCategory;
  project_id?: string;
  project_name?: string;
}

export interface ShareLink {
  url: string;
  expires_at: string;
  document_id: string;
  document_name: string;
}

export const CATEGORY_CONFIG: Record<DocumentCategory, { label: string; color: string; bgColor: string }> = {
  proposals: { label: 'Proposals', color: '#3B82F6', bgColor: '#EFF6FF' },
  contracts: { label: 'Contracts', color: '#8B5CF6', bgColor: '#F5F3FF' },
  deliverables: { label: 'Deliverables', color: '#00875A', bgColor: '#ECFDF5' },
  reports: { label: 'Reports', color: '#D97706', bgColor: '#FFFBEB' },
  exports: { label: 'Exports', color: '#14B8A6', bgColor: '#F0FDFA' },
};

export const FILE_TYPE_ICONS: Record<FileType, string> = {
  pdf: 'FileText',
  docx: 'FileText',
  png: 'Image',
  jpg: 'Image',
  xls: 'Table',
  xlsx: 'Table',
  txt: 'FileText',
  csv: 'Table',
  other: 'File',
};

/** Derive FileType from MIME type or extension */
export function getFileType(mimeType: string, fileName: string): FileType {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) return 'docx';
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || fileName.endsWith('.xls')) return 'xls';
  if (fileName.endsWith('.xlsx')) return 'xlsx';
  if (mimeType.includes('text/plain') || fileName.endsWith('.txt')) return 'txt';
  if (mimeType.includes('csv') || fileName.endsWith('.csv')) return 'csv';
  return 'other';
}

/** Format file size into human readable */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Format relative time */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
