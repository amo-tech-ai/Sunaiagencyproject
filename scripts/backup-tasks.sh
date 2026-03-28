#!/usr/bin/env bash
# Backup tasks/ to a timestamped tarball. Run from repo root.
# Usage: ./scripts/backup-tasks.sh [backup-dir]
# Default backup dir: ./backups (created if missing)

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
BACKUP_DIR="${1:-$REPO_ROOT/backups}"
STAMP=$(date +%Y%m%d-%H%M%S)
ARCHIVE="$BACKUP_DIR/tasks-backup-$STAMP.tar.gz"

mkdir -p "$BACKUP_DIR"
echo "Backing up tasks/ to $ARCHIVE ..."
tar czf "$ARCHIVE" tasks/
echo "Done. $(du -h "$ARCHIVE" | cut -f1)"
