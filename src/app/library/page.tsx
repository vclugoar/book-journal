'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BookCard, BookListItem, LibraryControls } from '@/components/library';
import { useBookStore } from '@/stores/bookStore';
import { getAllBooks } from '@/lib/db';

export default function LibraryPage() {
  const { books, setBooks, viewMode, getFilteredBooks, setIsLoading, isLoading } = useBookStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load books from IndexedDB
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const loadedBooks = await getAllBooks();
        setBooks(loadedBooks);
      } catch (error) {
        console.error('Failed to load books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      loadBooks();
    }
  }, [mounted, setBooks, setIsLoading]);

  const filteredBooks = getFilteredBooks();

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-sage" />
              <span className="font-serif text-lg font-semibold">Moodmark</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/book/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Book
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-muted-foreground">Loading your books...</div>
          </div>
        ) : books.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">Your reading journey begins here</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Add your first book to start capturing the magic of your reading adventures.
            </p>
            <Link href="/book/new">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Book
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <LibraryControls totalBooks={filteredBooks.length} />

            {/* Books */}
            <AnimatePresence mode="wait">
              {filteredBooks.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">No books match your search.</p>
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
                    <BookCard key={book.id} book={book} index={index} />
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
                    <div className="hidden md:block w-28 text-right">Finished</div>
                    <div className="w-5" />
                  </div>

                  {filteredBooks.map((book, index) => (
                    <BookListItem key={book.id} book={book} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
