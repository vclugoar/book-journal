'use client';

import { useState, useCallback, useRef } from 'react';
import { FileJson, Check, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Modal';
import { Button } from '@/components/ui';
import { parseBackupFile, importFromBackup, type BackupData } from '@/lib/export';
import { cn } from '@/lib/utils';

interface BackupImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

type ImportState = 'upload' | 'preview' | 'importing' | 'success' | 'error';
type ImportMode = 'merge' | 'replace';

export function BackupImportModal({
  open,
  onOpenChange,
  onImportComplete,
}: BackupImportModalProps) {
  const [state, setState] = useState<ImportState>('upload');
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [importResult, setImportResult] = useState<{ booksImported: number; collagesImported: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setState('upload');
    setBackupData(null);
    setError(null);
    setImportMode('merge');
    setImportResult(null);
    setIsDragOver(false);
  }, []);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        resetState();
      }
      onOpenChange(newOpen);
    },
    [onOpenChange, resetState]
  );

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      setState('error');
      return;
    }

    try {
      const text = await file.text();
      const data = parseBackupFile(text);
      setBackupData(data);
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse backup file');
      setState('error');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleImport = useCallback(async () => {
    if (!backupData) return;

    setState('importing');

    try {
      const result = await importFromBackup(backupData, importMode);
      setImportResult(result);
      setState('success');
      onImportComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import backup');
      setState('error');
    }
  }, [backupData, importMode, onImportComplete]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Restore from Backup</DialogTitle>
          <DialogDescription>
            Import a previously exported Moodmark backup to restore your library.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {state === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'mt-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <FileJson className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground font-medium mb-1">
                  Drop your backup file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Upload a <code className="bg-muted px-1 rounded">moodmark-backup-*.json</code> file
                  that was previously exported from the app.
                </p>
              </div>
            </motion.div>
          )}

          {state === 'preview' && backupData && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileJson className="h-4 w-4 text-primary" />
                  <span className="font-medium">Backup Details</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Exported: {formatDate(backupData.exportedAt)}</p>
                  <p>Books: {backupData.data.books.length}</p>
                  <p>Collages: {backupData.data.collages.length}</p>
                </div>
              </div>

              {/* Import Mode Selection */}
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Import Mode</p>
                <div className="space-y-2">
                  <label
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      importMode === 'merge'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm text-foreground">
                        Merge with existing
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Add new books without removing existing ones. Duplicate books (same title & author) will be skipped.
                      </div>
                    </div>
                  </label>
                  <label
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      importMode === 'replace'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm text-foreground flex items-center gap-2">
                        Replace all data
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Delete all existing books and import backup. This restores collages too.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="ghost" onClick={resetState}>
                  Choose Different File
                </Button>
                <Button onClick={handleImport}>
                  Import {backupData.data.books.length} Books
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {state === 'importing' && (
            <motion.div
              key="importing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-foreground font-medium">Importing backup...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Restoring your library
              </p>
            </motion.div>
          )}

          {state === 'success' && importResult && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-foreground font-medium">Import Complete!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {importResult.booksImported} books imported
                {importResult.collagesImported > 0 && `, ${importResult.collagesImported} collages restored`}
              </p>
              <DialogFooter className="mt-6 justify-center">
                <Button onClick={() => handleOpenChange(false)}>Done</Button>
              </DialogFooter>
            </motion.div>
          )}

          {state === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <X className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-foreground font-medium">Import Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <DialogFooter className="mt-6 justify-center">
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={resetState}>Try Again</Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
