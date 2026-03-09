// C-DOCUMENTS-PAGE — Main Document Management page at /app/documents
// Grid/list view, category filter, search, drag-drop upload, detail panel
// Mobile-first responsive, 44px touch targets, BCG design system

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText, Image, Table, File, Search, Grid3X3, List,
  Upload, RefreshCw, Download, Trash2, Share2, X, Link2,
  Check, Loader2, AlertCircle, FolderOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { documentApi } from '../../../lib/supabase';
import { useAuth } from '../../AuthContext';
import type { DocumentMeta, DocumentCategory } from '../../../lib/types/documents';
import { CATEGORY_CONFIG, formatFileSize, formatRelativeTime } from '../../../lib/types/documents';

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'proposals', label: 'Proposals' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'deliverables', label: 'Deliverables' },
  { value: 'reports', label: 'Reports' },
  { value: 'exports', label: 'Exports' },
];

function getFileIcon(fileType: string) {
  switch (fileType) {
    case 'pdf':
    case 'docx':
    case 'txt':
      return FileText;
    case 'png':
    case 'jpg':
      return Image;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return Table;
    default:
      return File;
  }
}

function getFileIconColor(fileType: string): string {
  switch (fileType) {
    case 'pdf': return '#EF4444';
    case 'docx': return '#3B82F6';
    case 'png':
    case 'jpg': return '#8B5CF6';
    case 'xls':
    case 'xlsx': return '#22C55E';
    case 'csv': return '#14B8A6';
    case 'txt': return '#6B7280';
    default: return '#9CA3AF';
  }
}

export default function DocumentManagementPage() {
  const { accessToken } = useAuth();
  const token = accessToken ? 'use-fresh-token' : undefined;

  // Data state
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [stats, setStats] = useState<{ total: number; totalSize: number; byCategory: Record<string, number>; recentCount: number } | null>(null);

  // Filter state
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; status: 'uploading' | 'done' | 'error' }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMeta | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Fetch documents ──
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsRes, statsRes] = await Promise.all([
        documentApi.list({ category: category !== 'all' ? category : undefined, search: search || undefined }, token),
        documentApi.getStats(token),
      ]);

      if (docsRes.data?.documents) {
        setDocuments(docsRes.data.documents);
      }
      if (docsRes.error) {
        setError(docsRes.error);
        console.error('[Documents] Fetch error:', docsRes.error);
      }
      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      setError(String(err));
      console.error('[Documents] Fetch exception:', err);
    } finally {
      setLoading(false);
    }
  }, [token, category, search]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      // fetchDocuments will re-run via useEffect dep on `search`
    }, 300);
  };

  // ── File upload ──
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    const progress = fileArray.map(f => ({ name: f.name, status: 'uploading' as const }));
    setUploadProgress(progress);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        const res = await documentApi.upload(
          file,
          { name: file.name, category: category !== 'all' ? category : 'deliverables' },
          token
        );
        if (res.error) {
          progress[i] = { name: file.name, status: 'error' };
          console.error(`[Documents] Upload error for ${file.name}:`, res.error);
        } else {
          progress[i] = { name: file.name, status: 'done' };
        }
      } catch (err) {
        progress[i] = { name: file.name, status: 'error' };
        console.error(`[Documents] Upload exception for ${file.name}:`, err);
      }
      setUploadProgress([...progress]);
    }

    setUploading(false);
    // Clear progress after 3s and refresh
    setTimeout(() => setUploadProgress([]), 3000);
    fetchDocuments();
  };

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // ── Share link ──
  const handleShare = async (docId: string) => {
    setShareLoading(true);
    setShareUrl(null);
    try {
      const res = await documentApi.share(docId, 86400, token);
      if (res.data?.share?.url) {
        setShareUrl(res.data.share.url);
      }
    } catch (err) {
      console.error('[Documents] Share error:', err);
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  // ── Delete ──
  const handleDelete = async (docId: string) => {
    try {
      await documentApi.delete(docId, token);
      setDocuments(prev => prev.filter(d => d.id !== docId));
      setDeleteConfirm(null);
      if (selectedDoc?.id === docId) setSelectedDoc(null);
    } catch (err) {
      console.error('[Documents] Delete error:', err);
    }
  };

  // ── Download (open signed URL) ──
  const handleDownload = async (doc: DocumentMeta) => {
    try {
      const res = await documentApi.get(doc.id, token);
      if (res.data?.document?.signed_url) {
        window.open(res.data.document.signed_url, '_blank');
      }
    } catch (err) {
      console.error('[Documents] Download error:', err);
    }
  };

  // ── Loading state ──
  if (loading && documents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-[#E8E8E4] rounded w-48 mb-4" />
          <div className="h-10 bg-[#E8E8E4] rounded w-full mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={`skel-${i}`} className="h-48 bg-[#E8E8E4] rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#00875A]/10 border-2 border-dashed border-[#00875A] z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <Upload className="w-10 h-10 text-[#00875A] mx-auto mb-3" />
              <p className="text-lg font-semibold text-[#1A1A1A]">Drop files to upload</p>
              <p className="text-sm text-[#6B6B63]">PDF, DOCX, PNG, JPG, XLS, CSV up to 50MB</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-[Georgia,serif] font-semibold text-[#1A1A1A]">
            Documents
          </h1>
          {stats && (
            <p className="text-sm text-[#6B6B63] mt-0.5">
              {stats.total} {stats.total === 1 ? 'file' : 'files'}
              {' '}&middot; {formatFileSize(stats.totalSize)}
              {stats.recentCount > 0 && (
                <span className="text-[#00875A]"> &middot; {stats.recentCount} this week</span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDocuments}
            className="p-2 border border-[#E8E8E4] rounded hover:bg-[#F5F5F0] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Refresh documents"
          >
            <RefreshCw className={`w-4 h-4 text-[#6B6B63] ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-[#00875A] text-white rounded hover:bg-[#006B48] transition-colors min-h-[44px] disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.xls,.xlsx,.txt,.csv"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-1"
          >
            {uploadProgress.map((p, i) => (
              <div key={`upload-${i}`} className="flex items-center gap-2 text-sm px-3 py-2 bg-[#F5F5F0] border border-[#E8E8E4] rounded">
                {p.status === 'uploading' && <Loader2 className="w-4 h-4 text-[#00875A] animate-spin shrink-0" />}
                {p.status === 'done' && <Check className="w-4 h-4 text-[#00875A] shrink-0" />}
                {p.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                <span className="truncate text-[#1A1A1A]">{p.name}</span>
                <span className="ml-auto text-xs text-[#6B6B63]">
                  {p.status === 'uploading' ? 'Uploading...' : p.status === 'done' ? 'Done' : 'Failed'}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA39B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E8E8E4] rounded focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A] placeholder:text-[#9CA39B] min-h-[44px]"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-1 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors min-h-[32px] ${
                category === cat.value
                  ? 'bg-[#00875A] text-white'
                  : 'bg-[#F5F5F0] text-[#6B6B63] hover:bg-[#E8E8E4]'
              }`}
            >
              {cat.label}
              {stats?.byCategory[cat.value] !== undefined && (
                <span className="ml-1 opacity-70">({stats.byCategory[cat.value]})</span>
              )}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex border border-[#E8E8E4] rounded overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors ${
              viewMode === 'grid' ? 'bg-[#00875A] text-white' : 'bg-white text-[#6B6B63] hover:bg-[#F5F5F0]'
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors ${
              viewMode === 'list' ? 'bg-[#00875A] text-white' : 'bg-white text-[#6B6B63] hover:bg-[#F5F5F0]'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={fetchDocuments} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && documents.length === 0 && (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-14 h-14 bg-[#F5F5F0] border border-[#E8E8E4] rounded-xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-[#00875A]" />
          </div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">No documents yet</h2>
          <p className="text-sm text-[#6B6B63] mb-4 leading-relaxed">
            Upload your first document — proposals, contracts, deliverables, reports, or analysis exports.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-[#00875A] text-white rounded hover:bg-[#006B48] transition-colors min-h-[44px]"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
          <p className="text-xs text-[#9CA39B] mt-3">
            Or drag and drop files anywhere on this page
          </p>
        </div>
      )}

      {/* Grid View */}
      {documents.length > 0 && viewMode === 'grid' && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {documents.map((doc, i) => {
            const IconComponent = getFileIcon(doc.file_type);
            const iconColor = getFileIconColor(doc.file_type);
            const catConfig = CATEGORY_CONFIG[doc.category as DocumentCategory] || CATEGORY_CONFIG.deliverables;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedDoc(doc)}
                className="group bg-white border border-[#E8E8E4] rounded-lg p-4 cursor-pointer hover:border-l-2 hover:border-l-[#00875A] hover:shadow-sm transition-all"
              >
                {/* Icon area */}
                <div className="w-full h-20 bg-[#FAFAF8] rounded flex items-center justify-center mb-3">
                  <IconComponent className="w-10 h-10" style={{ color: iconColor }} />
                </div>

                {/* Name */}
                <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-2 mb-1.5 leading-tight">
                  {doc.name}
                </h3>

                {/* Category badge */}
                <span
                  className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: catConfig.bgColor, color: catConfig.color }}
                >
                  {catConfig.label}
                </span>

                {/* Meta row */}
                <div className="flex items-center justify-between text-xs text-[#6B6B63]">
                  <span>{formatRelativeTime(doc.created_at)}</span>
                  <span>{formatFileSize(doc.file_size)}</span>
                </div>

                {/* Action buttons (visible on hover) */}
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                    className="p-1.5 hover:bg-[#F5F5F0] rounded transition-colors"
                    aria-label="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-[#6B6B63]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare(doc.id); setSelectedDoc(doc); }}
                    className="p-1.5 hover:bg-[#F5F5F0] rounded transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#6B6B63]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(doc.id); }}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors ml-auto"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* List View */}
      {documents.length > 0 && viewMode === 'list' && (
        <div className="border border-[#E8E8E4] rounded-lg overflow-hidden bg-white">
          {/* Header */}
          <div className="hidden md:grid md:grid-cols-[1fr_120px_120px_100px_80px] gap-4 px-4 py-2.5 bg-[#FAFAF8] border-b border-[#E8E8E4] text-xs font-medium text-[#6B6B63] uppercase tracking-wide">
            <span>Name</span>
            <span>Category</span>
            <span>Size</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          {documents.map((doc) => {
            const IconComponent = getFileIcon(doc.file_type);
            const iconColor = getFileIconColor(doc.file_type);
            const catConfig = CATEGORY_CONFIG[doc.category as DocumentCategory] || CATEGORY_CONFIG.deliverables;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_100px_80px] gap-2 md:gap-4 items-center px-4 py-3 border-b border-[#E8E8E4] last:border-b-0 cursor-pointer hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 shrink-0" style={{ color: iconColor }} />
                  <span className="text-sm font-medium text-[#1A1A1A] truncate">{doc.name}</span>
                </div>
                <span
                  className="inline-block text-xs font-medium px-2 py-0.5 rounded-full w-fit"
                  style={{ backgroundColor: catConfig.bgColor, color: catConfig.color }}
                >
                  {catConfig.label}
                </span>
                <span className="text-xs text-[#6B6B63]">{formatFileSize(doc.file_size)}</span>
                <span className="text-xs text-[#6B6B63]">{formatRelativeTime(doc.created_at)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                    className="p-1.5 hover:bg-[#E8E8E4] rounded"
                    aria-label="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-[#6B6B63]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(doc.id); }}
                    className="p-1.5 hover:bg-red-50 rounded"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel (Slide-out) */}
      <AnimatePresence>
        {selectedDoc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => { setSelectedDoc(null); setShareUrl(null); }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-xl border-l border-[#E8E8E4] overflow-y-auto"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#E8E8E4]">
                <h2 className="text-base font-semibold text-[#1A1A1A] truncate pr-2">
                  {selectedDoc.name}
                </h2>
                <button
                  onClick={() => { setSelectedDoc(null); setShareUrl(null); }}
                  className="p-2 hover:bg-[#F5F5F0] rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-[#6B6B63]" />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* File icon + type */}
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getFileIcon(selectedDoc.file_type);
                    return <Icon className="w-10 h-10" style={{ color: getFileIconColor(selectedDoc.file_type) }} />;
                  })()}
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{selectedDoc.file_type.toUpperCase()}</p>
                    <p className="text-xs text-[#6B6B63]">{formatFileSize(selectedDoc.file_size)}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3">
                  <DetailRow label="Category">
                    {(() => {
                      const cat = CATEGORY_CONFIG[selectedDoc.category as DocumentCategory] || CATEGORY_CONFIG.deliverables;
                      return (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: cat.bgColor, color: cat.color }}
                        >
                          {cat.label}
                        </span>
                      );
                    })()}
                  </DetailRow>
                  {selectedDoc.project_name && (
                    <DetailRow label="Project">{selectedDoc.project_name}</DetailRow>
                  )}
                  <DetailRow label="Uploaded">{new Date(selectedDoc.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</DetailRow>
                  <DetailRow label="Version">v{selectedDoc.version}</DetailRow>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleDownload(selectedDoc)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 bg-[#00875A] text-white rounded hover:bg-[#006B48] transition-colors min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>

                  <button
                    onClick={() => handleShare(selectedDoc.id)}
                    disabled={shareLoading}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 border border-[#E8E8E4] rounded hover:bg-[#F5F5F0] transition-colors min-h-[44px] disabled:opacity-50"
                  >
                    {shareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                    Generate Share Link
                  </button>

                  {/* Share URL display */}
                  {shareUrl && (
                    <div className="p-3 bg-[#F5F5F0] border border-[#E8E8E4] rounded space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#6B6B63]">
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Share link (expires in 24h)</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={shareUrl}
                          className="flex-1 text-xs bg-white border border-[#E8E8E4] rounded px-2 py-1.5 truncate"
                        />
                        <button
                          onClick={handleCopyShareUrl}
                          className="text-xs px-3 py-1.5 bg-[#00875A] text-white rounded hover:bg-[#006B48] transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setDeleteConfirm(selectedDoc.id)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Document
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl z-[61] w-[90vw] max-w-sm"
            >
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">Delete document?</h3>
              <p className="text-sm text-[#6B6B63] mb-4">
                This will permanently delete the file from storage. This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-sm px-4 py-2 border border-[#E8E8E4] rounded hover:bg-[#F5F5F0] transition-colors min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors min-h-[40px]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#6B6B63] uppercase tracking-wide">{label}</span>
      <span className="text-sm text-[#1A1A1A]">{children}</span>
    </div>
  );
}
