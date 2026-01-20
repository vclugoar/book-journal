'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Sparkles } from 'lucide-react';

const cozyMessages = [
  "Your reading nook awaits...",
  "Every great library starts with one book",
  "Ready to capture some reading magic?",
  "Your stories are waiting to be remembered",
  "Time to start your cozy collection",
];
import { Button } from '@/components/ui';
import { Navigation } from '@/components/layout';
import { BookCard, BookListItem, LibraryControls } from '@/components/library';
import { GoodreadsImportModal, BackupImportModal, ImportDropdown } from '@/components/import';
import { ExportDropdown } from '@/components/export';
import { useAuth } from '@/components/auth';
import { useBookStore } from '@/stores/bookStore';
import { useUIStore } from '@/stores/uiStore';
import { getAllBooks, getAllCollages, deleteAllBooks, syncWithCloud, deleteBookWithSync, importLocalBooksToCloud } from '@/lib/db';
import { exportLibraryAsJSON, exportLibraryAsCSV } from '@/lib/export';
import type { Collage } from '@/types';

export default function LibraryPage() {
  const { user } = useAuth();
  const {
    books,
    setBooks,
    removeBook,
    viewMode,
    getFilteredBooks,
    setIsLoading,
    isLoading,
    setIsSyncing,
    setLastSyncTime,
    setUserId
  } = useBookStore();
  const addToast = useUIStore((state) => state.addToast);
  const [mounted, setMounted] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [collageMap, setCollageMap] = useState<Record<string, Collage>>({});
  const [allCollages, setAllCollages] = useState<Collage[]>([]);
  const [hasImportedLocal, setHasImportedLocal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load books from local IndexedDB (fast)
  const loadLocalBooks = useCallback(async () => {
    const [loadedBooks, loadedCollages] = await Promise.all([
      getAllBooks(),
      getAllCollages(),
    ]);
    setBooks(loadedBooks);
    setAllCollages(loadedCollages);

    const map: Record<string, Collage> = {};
    loadedCollages.forEach((collage) => {
      map[collage.bookId] = collage;
    });
    setCollageMap(map);
    return { books: loadedBooks, collages: loadedCollages };
  }, [setBooks]);

  // Sync with cloud in background (non-blocking)
  const syncInBackground = useCallback(async (userId: string) => {
    setIsSyncing(true);
    try {
      // Check if we need to import local books on first login
      if (!hasImportedLocal) {
        const localBooks = await getAllBooks();
        if (localBooks.length > 0) {
          const imported = await importLocalBooksToCloud(userId);
          if (imported > 0) {
            addToast({
              type: 'success',
              message: `Synced ${imported} books to cloud`,
            });
            setHasImportedLocal(true);
          }
        }
      }

      const { books: cloudBooks, collages: cloudCollages } = await syncWithCloud(userId);

      // Update state with cloud data
      setBooks(cloudBooks);
      setAllCollages(cloudCollages);

      const map: Record<string, Collage> = {};
      cloudCollages.forEach((collage) => {
        map[collage.bookId] = collage;
      });
      setCollageMap(map);
      setLastSyncTime(new Date().toISOString());
    } catch (syncError) {
      console.error('Cloud sync failed:', syncError);
    } finally {
      setIsSyncing(false);
    }
  }, [setBooks, setIsSyncing, setLastSyncTime, hasImportedLocal, addToast]);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Step 1: Load from local IndexedDB first (instant)
      await loadLocalBooks();
      setIsLoading(false);

      // Step 2: If logged in, sync with cloud in background
      if (user?.id) {
        // Don't await - let it run in background
        syncInBackground(user.id);
      }
    } catch (error) {
      console.error('Failed to load books:', error);
      setIsLoading(false);
    }
  }, [loadLocalBooks, syncInBackground, user?.id, setIsLoading]);

  const handleImportComplete = useCallback(() => {
    loadBooks();
  }, [loadBooks]);

  // Set userId when user changes
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    } else {
      setUserId(null);
    }
  }, [user?.id, setUserId]);

  const handleDeleteBook = useCallback(async (id: string) => {
    const bookToDelete = books.find((b) => b.id === id);
    await deleteBookWithSync(id, user?.id || null);
    removeBook(id);
    // Update collage map
    setCollageMap((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    addToast({
      type: 'success',
      message: bookToDelete ? `Deleted "${bookToDelete.title}"` : 'Book deleted',
    });
  }, [books, removeBook, addToast, user?.id]);

  const handleDeleteAllBooks = useCallback(async () => {
    const count = books.length;
    await deleteAllBooks();
    setBooks([]);
    setCollageMap({});
    setAllCollages([]);
    addToast({
      type: 'success',
      message: `Deleted ${count} books from library`,
    });
  }, [books, setBooks, addToast]);

  const handleExportJSON = useCallback(() => {
    exportLibraryAsJSON(books, allCollages);
    addToast({
      type: 'success',
      message: `Exported ${books.length} books as JSON backup`,
    });
  }, [books, allCollages, addToast]);

  const handleExportCSV = useCallback(() => {
    exportLibraryAsCSV(books);
    addToast({
      type: 'success',
      message: `Exported ${books.length} books as CSV`,
    });
  }, [books, addToast]);

  // Load books from IndexedDB
  useEffect(() => {
    if (mounted) {
      loadBooks();
    }
  }, [mounted, loadBooks]);

  const filteredBooks = getFilteredBooks();

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation>
        <ExportDropdown
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
          disabled={books.length === 0}
        />
        <ImportDropdown
          onImportGoodreads={() => setImportModalOpen(true)}
          onRestoreBackup={() => setBackupModalOpen(true)}
        />
        <Link href="/book/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </Link>
      </Navigation>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-muted-foreground">Loading your books...</div>
          </div>
        ) : books.length === 0 ? (
          /* Empty State - Cozy Version */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 relative"
          >
            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.span
                className="absolute top-8 left-1/4 text-2xl opacity-30"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                📚
              </motion.span>
              <motion.span
                className="absolute top-16 right-1/4 text-xl opacity-20"
                animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                ✨
              </motion.span>
              <motion.span
                className="absolute bottom-20 left-1/3 text-lg opacity-25"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                🌙
              </motion.span>
              <motion.span
                className="absolute bottom-28 right-1/3 text-xl opacity-20"
                animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              >
                ☕
              </motion.span>
            </div>

            {/* Main content */}
            <motion.div
              className="relative w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-lg shadow-amber-200/20 dark:shadow-amber-900/10"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen className="h-12 w-12 text-amber-600 dark:text-amber-400" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-5 w-5 text-amber-500" />
              </motion.div>
            </motion.div>

            <h2 className="font-serif text-2xl font-semibold mb-3 text-foreground">
              {cozyMessages[Math.floor(Math.random() * cozyMessages.length)]}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Every book holds a world of feelings. Start capturing yours.
            </p>
            <Link href="/book/new">
              <Button size="lg" className="shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Book
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <LibraryControls totalBooks={filteredBooks.length} onDeleteAll={handleDeleteAllBooks} />

            {/* Books */}
            <AnimatePresence mode="wait">
              {filteredBooks.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-16"
                >
                  <motion.span
                    className="text-4xl inline-block mb-4"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      y: [0, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    🔍
                  </motion.span>
                  <p className="font-serif text-lg text-foreground mb-2">
                    No stories found in this corner...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search or explore your full collection
                  </p>
                </motion.div>
              ) : viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {filteredBooks.map((book, index) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      index={index}
                      collageThumbnail={collageMap[book.id]?.thumbnail}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {/* List header */}
                  <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">
                    <div className="w-12 flex-shrink-0" />
                    <div className="flex-1">Title / Author</div>
                    <div className="hidden sm:block w-24 text-center">Rating</div>
                    <div className="hidden sm:block w-20">Magic</div>
                    <div className="hidden md:block w-28 text-right">Finished</div>
                    <div className="w-5" />
                  </div>

                  {filteredBooks.map((book, index) => (
                    <BookListItem
                      key={book.id}
                      book={book}
                      index={index}
                      collageThumbnail={collageMap[book.id]?.thumbnail}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <GoodreadsImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImportComplete={handleImportComplete}
      />

      <BackupImportModal
        open={backupModalOpen}
        onOpenChange={setBackupModalOpen}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}
