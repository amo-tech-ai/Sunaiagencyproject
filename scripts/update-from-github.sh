#!/usr/bin/env bash
# Safe GitHub update: backup protected paths, sync from origin/main, restore local knowledge.
# Usage: ./scripts/update-from-github.sh
#        KEEP_GITHUB_SUPABASE=1 ./scripts/update-from-github.sh  # keep GitHub supabase, merge migrations only
# Backup root: ../_backups/sunv2/backup-YYYYMMDD-HHMMSS
# Rule: .cursor/rules/github-update.mdc

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_ROOT="${REPO_ROOT}/../_backups/sunv2"
STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="${BACKUP_ROOT}/backup-${STAMP}"

# Protected paths (preserve local). Backup and restore these.
PROTECTED_DIRS=(
  .cursor
  .claude
  .agents
  plan
  pm
  prompts
  tasks
  scripts
  screenshots
  figma
  figma-2
  sunai-figma
  images
  notes
  website
  roadmap
)
PROTECTED_FILES=(
  roadmap.md
  prd.md
  system.md
  todo.md
  changelog
  progress-tracker.md
  IMPLEMENTATION_PLAN.md
  TASKS_TABLE.md
  style-guide.md
  index.md
  skills.md
  .env.local
  .mcp.json
  CLAUDE.md
  CLAUDE.local.md
  AGENTS.md
)

cd "$REPO_ROOT"
echo "=== Backup (update-from-github) ==="
echo "Repo: $REPO_ROOT"
echo "Backup: $BACKUP_DIR"

mkdir -p "$BACKUP_DIR"
for d in "${PROTECTED_DIRS[@]}"; do
  if [[ -e "$d" ]]; then
    echo "  backup dir: $d"
    cp -a "$d" "$BACKUP_DIR/" || { echo "ERROR: backup failed for $d" >&2; exit 1; }
  fi
done
for f in "${PROTECTED_FILES[@]}"; do
  if [[ -f "$f" ]]; then
    echo "  backup file: $f"
    mkdir -p "$BACKUP_DIR/files"
    cp -a "$f" "$BACKUP_DIR/files/" || { echo "ERROR: backup failed for $f" >&2; exit 1; }
  fi
done
# Supabase: full backup (for restore or merge)
if [[ -d supabase ]]; then
  echo "  backup dir: supabase"
  cp -a supabase "$BACKUP_DIR/" || { echo "ERROR: backup failed for supabase" >&2; exit 1; }
fi

# Verify backup
if [[ ! -d "$BACKUP_DIR" ]]; then
  echo "ERROR: Backup dir not created" >&2
  exit 1
fi
if [[ -d "$REPO_ROOT/.cursor" ]] && [[ ! -d "$BACKUP_DIR/.cursor" ]]; then
  echo "ERROR: .cursor not in backup" >&2
  exit 1
fi
echo "Backup verified."

# Sync from origin/main
echo "=== Sync from origin/main ==="
git fetch origin
git checkout main 2>/dev/null || git checkout -b main origin/main
git reset --hard origin/main

# Restore protected paths
echo "=== Restore protected paths ==="
for d in "${PROTECTED_DIRS[@]}"; do
  if [[ -d "$BACKUP_DIR/$d" ]]; then
    echo "  restore: $d"
    rm -rf "$REPO_ROOT/$d"
    cp -a "$BACKUP_DIR/$d" "$REPO_ROOT/" || { echo "ERROR: restore failed for $d" >&2; exit 1; }
  fi
done
if [[ -d "$BACKUP_DIR/files" ]]; then
  shopt -s nullglob
  for f in "$BACKUP_DIR/files"/* "$BACKUP_DIR/files"/.*; do
    [[ -f "$f" ]] || continue
    name="$(basename "$f")"
    [[ "$name" == . || "$name" == .. ]] && continue
    echo "  restore: $name"
    cp -a "$f" "$REPO_ROOT/$name" || { echo "ERROR: restore failed for $name" >&2; exit 1; }
  done
  shopt -u nullglob 2>/dev/null || true
fi

# Supabase: full restore, or keep GitHub and merge migrations only
if [[ -d "$BACKUP_DIR/supabase" ]]; then
  if [[ -n "${KEEP_GITHUB_SUPABASE:-}" ]]; then
    echo "  restore: supabase/migrations (merge — keep GitHub, add local-only)"
    mkdir -p "$REPO_ROOT/supabase/migrations"
    for f in "$BACKUP_DIR/supabase/migrations"/*.sql; do
      [[ -f "$f" ]] || continue
      name="$(basename "$f")"
      if [[ ! -f "$REPO_ROOT/supabase/migrations/$name" ]]; then
        cp -a "$f" "$REPO_ROOT/supabase/migrations/"
        echo "    added: $name"
      else
        echo "    skip (exists): $name"
      fi
    done
  else
    echo "  restore: supabase (full)"
    rm -rf "$REPO_ROOT/supabase"
    cp -a "$BACKUP_DIR/supabase" "$REPO_ROOT/" || { echo "ERROR: restore failed for supabase" >&2; exit 1; }
  fi
fi

echo "=== Done. Backup at: $BACKUP_DIR ==="
