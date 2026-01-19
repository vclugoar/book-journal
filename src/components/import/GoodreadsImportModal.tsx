'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { Upload, FileText, Check, X } from 'lucide-react';
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
import { parseGoodreadsCSV, mapToBookEntry, type GoodreadsBook } from '@/lib/csv/parseGoodreadsCSV';
import { bulkCreateBooks } from '@/lib/db';
import { cn } from '@/lib/utils';

interface GoodreadsImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

type ImportState = 'upload' | 'preview' | 'importing' | 'success' | 'error';
type ShelfFilter = 'all' | 'read' | 'to-read' | 'currently-reading';

export function GoodreadsImportModal({
  open,
  onOpenChange,
  onImportComplete,
}: GoodreadsImportModalProps) {
  const [state, setState] = useState<ImportState>('upload');
  const [parsedBooks, setParsedBooks] = useState<GoodreadsBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [shelfFilter, setShelfFilter] = useState<ShelfFilter>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shelfCounts = useMemo(() => {
    const counts = { all: 0, read: 0, 'to-read': 0, 'currently-reading': 0 };
    parsedBooks.forEach((book) => {
      counts.all++;
      if (book.exclusiveShelf === 'read') counts.read++;
      else if (book.exclusiveShelf === 'to-read') counts['to-read']++;
      else if (book.exclusiveShelf === 'currently-reading') counts['currently-reading']++;
    });
    return counts;
  }, [parsedBooks]);

  const filteredBooks = useMemo(() => {
    if (shelfFilter === 'all') return parsedBooks;
    return parsedBooks.filter((book) => book.exclusiveShelf === shelfFilter);
  }, [parsedBooks, shelfFilter]);

  const resetState = useCallback(() => {
    setState('upload');
    setParsedBooks([]);
    setError(null);
    setImportedCount(0);
    setIsDragOver(false);
    setShelfFilter('all');
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
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setState('error');
      return;
    }

    try {
      const text = await file.text();
      const books = parseGoodreadsCSV(text);

      if (books.length === 0) {
        setError('No books found in the CSV file');
        setState('error');
        return;
      }

      setParsedBooks(books);
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
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
    setState('importing');

    try {
      const bookEntries = filteredBooks.map(mapToBookEntry);
      await bulkCreateBooks(bookEntries);
      setImportedCount(bookEntries.length);
      setState('success');
      onImportComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import books');
      setState('error');
    }
  }, [filteredBooks, onImportComplete]);

  const renderStars = (rating: number) => {
    return (
      <span className="text-amber-500">
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import from Goodreads</DialogTitle>
          <DialogDescription>
            Upload your Goodreads library export to quickly add books to your collection.
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
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground font-medium mb-1">
                  Drop your Goodreads CSV here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">How to export from Goodreads:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Go to My Books on Goodreads</li>
                  <li>Click &quot;Import and Export&quot; in the left sidebar</li>
                  <li>Click &quot;Export Library&quot;</li>
                  <li>Download the CSV file</li>
                </ol>
              </div>
            </motion.div>
          )}

          {state === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Found {parsedBooks.length} books in your library</span>
              </div>

              {/* Shelf Filter Tabs */}
              <div className="mt-4 flex flex-wrap gap-2">
                {([
                  { key: 'all', label: 'All' },
                  { key: 'read', label: 'Read' },
                  { key: 'to-read', label: 'To Read' },
                  { key: 'currently-reading', label: 'Reading' },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setShelfFilter(key)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full transition-colors',
                      shelfFilter === key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {label} ({shelfCounts[key]})
                  </button>
                ))}
              </div>

              <div className="mt-4 max-h-64 overflow-auto border border-border rounded-lg">
                <table className="w-full text-sm min-w-[400px]">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Title</th>
                      <th className="text-left px-3 py-2 font-medium hidden sm:table-cell">Author</th>
                      <th className="text-center px-3 py-2 font-medium">Rating</th>
                      <th className="text-right px-3 py-2 font-medium hidden sm:table-cell">Date Read</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="px-3 py-2">
                          <div className="truncate max-w-[180px] sm:max-w-[200px]" title={book.title}>
                            {book.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate sm:hidden">
                            {book.author}
                          </div>
                        </td>
                        <td className="px-3 py-2 truncate max-w-[150px] hidden sm:table-cell" title={book.author}>
                          {book.author}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {book.myRating > 0 ? renderStars(book.myRating) : '—'}
                        </td>
                        <td className="px-3 py-2 text-right text-muted-foreground hidden sm:table-cell">
                          {book.dateRead || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="ghost" onClick={resetState}>
                  Choose Different File
                </Button>
                <Button onClick={handleImport} disabled={filteredBooks.length === 0}>
                  Import {filteredBooks.length} Books
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
              <p className="text-foreground font-medium">Importing books...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Adding {filteredBooks.length} books to your library
              </p>
            </motion.div>
          )}

          {state === 'success' && (
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
                Successfully imported {importedCount} books
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
