'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Trash2, Palette, BookOpen } from 'lucide-react';
import { Button, Card, CardContent, Input, Textarea, SaveIndicator, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui';
import { OverallMagic, CozinessLevel, MissedMyStopRisk, RereadLikelihood, Lendability } from '@/components/ratings';
import { SeasonPicker, WeatherPicker, TimeOfDayPicker, ScentTags, RoomPicker, FortuneCookie, QuoteForPillow } from '@/components/prompts';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAutoSave } from '@/hooks';
import { getBook, updateBook, deleteBook } from '@/lib/db';
import { useBookStore } from '@/stores/bookStore';
import { type BookRatings, type BookPrompts, createEmptyBook } from '@/types';
import { cn } from '@/lib/utils';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { updateBook: updateStoreBook, removeBook, setIsSaving, isSaving, lastSaved, setLastSaved } = useBookStore();

  const [bookData, setBookData] = useState(createEmptyBook());
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['ratings']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load book data
  useEffect(() => {
    if (!bookId) return;

    const loadBook = async () => {
      try {
        const book = await getBook(bookId);
        if (book) {
          setBookData({
            title: book.title,
            author: book.author,
            dateStarted: book.dateStarted,
            dateFinished: book.dateFinished,
            ratings: book.ratings,
            prompts: book.prompts,
            coverImage: book.coverImage,
            notes: book.notes,
          });
        } else {
          router.push('/library');
        }
      } catch (error) {
        console.error('Failed to load book:', error);
        router.push('/library');
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [bookId, router]);

  // Auto-save functionality
  const handleSave = useCallback(async (data: typeof bookData) => {
    if (!data.title.trim() || !bookId) return;

    setIsSaving(true);
    try {
      await updateBook(bookId, data);
      updateStoreBook(bookId, data);
      setLastSaved(new Date().toISOString());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [bookId, updateStoreBook, setIsSaving, setLastSaved]);

  useAutoSave({
    data: bookData,
    onSave: handleSave,
    delay: 2000,
    enabled: mounted && !isLoading && !!bookData.title.trim(),
  });

  const handleDelete = async () => {
    try {
      await deleteBook(bookId);
      removeBook(bookId);
      router.push('/library');
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const updateRatings = (key: keyof BookRatings, value: BookRatings[typeof key]) => {
    setBookData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [key]: value },
    }));
  };

  const updatePrompts = (key: keyof BookPrompts, value: BookPrompts[typeof key]) => {
    setBookData((prev) => ({
      ...prev,
      prompts: { ...prev.prompts, [key]: value },
    }));
  };

  const sections = [
    {
      id: 'ratings',
      title: 'Whimsical Ratings',
      icon: <span className="text-lg">✨</span>,
      content: (
        <div className="space-y-8">
          <OverallMagic
            value={bookData.ratings.overallMagic}
            onChange={(v) => updateRatings('overallMagic', v)}
          />
          <CozinessLevel
            value={bookData.ratings.cozinessLevel}
            onChange={(v) => updateRatings('cozinessLevel', v)}
          />
          <MissedMyStopRisk
            value={bookData.ratings.missedMyStopRisk}
            onChange={(v) => updateRatings('missedMyStopRisk', v)}
          />
          <RereadLikelihood
            value={bookData.ratings.rereadLikelihood}
            onChange={(v) => updateRatings('rereadLikelihood', v)}
          />
          <Lendability
            value={bookData.ratings.lendability}
            onChange={(v) => updateRatings('lendability', v)}
          />
        </div>
      ),
    },
    {
      id: 'sensory',
      title: 'Sensory Prompts',
      icon: <span className="text-lg">🌸</span>,
      content: (
        <div className="space-y-8">
          <SeasonPicker
            value={bookData.prompts.season}
            onChange={(v) => updatePrompts('season', v)}
          />
          <TimeOfDayPicker
            value={bookData.prompts.timeOfDay}
            onChange={(v) => updatePrompts('timeOfDay', v)}
          />
          <WeatherPicker
            value={bookData.prompts.weather}
            onChange={(v) => updatePrompts('weather', v)}
          />
          <ScentTags
            value={bookData.prompts.scents}
            onChange={(v) => updatePrompts('scents', v)}
          />
        </div>
      ),
    },
    {
      id: 'imagination',
      title: 'Imagination Prompts',
      icon: <span className="text-lg">💭</span>,
      content: (
        <div className="space-y-8">
          <RoomPicker
            value={bookData.prompts.roomInHouse}
            onChange={(v) => updatePrompts('roomInHouse', v)}
          />
          <FortuneCookie
            value={bookData.prompts.fortuneCookieMessage}
            onChange={(v) => updatePrompts('fortuneCookieMessage', v)}
          />
          <QuoteForPillow
            value={bookData.prompts.quoteForPillow}
            onChange={(v) => updatePrompts('quoteForPillow', v)}
          />
        </div>
      ),
    },
  ];

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/library">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-serif text-lg font-semibold truncate max-w-[200px]">
                {bookData.title || 'Edit Book'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Book Details Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Input
                label="Book Title"
                value={bookData.title}
                onChange={(e) => setBookData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter the book title..."
              />
              <Input
                label="Author"
                value={bookData.author}
                onChange={(e) => setBookData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Who wrote this book?"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date Started"
                  type="date"
                  value={bookData.dateStarted || ''}
                  onChange={(e) => setBookData((prev) => ({ ...prev, dateStarted: e.target.value || null }))}
                />
                <Input
                  label="Date Finished"
                  type="date"
                  value={bookData.dateFinished || ''}
                  onChange={(e) => setBookData((prev) => ({ ...prev, dateFinished: e.target.value || null }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Expandable Sections */}
          {sections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);

            return (
              <Card key={section.id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    'w-full px-6 py-4 flex items-center justify-between',
                    'hover:bg-muted/50 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span className="font-serif text-lg font-medium">{section.title}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="border-t border-border">
                        {section.content}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}

          {/* Notes */}
          <Card>
            <CardContent className="pt-6">
              <Textarea
                label="Notes & Thoughts"
                value={bookData.notes}
                onChange={(e) => setBookData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any other thoughts about this book..."
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>

            <div className="flex items-center gap-3">
              <Link href={`/collage/${bookId}`}>
                <Button variant="secondary">
                  <Palette className="mr-2 h-4 w-4" />
                  Vibe Collage
                </Button>
              </Link>
              <Button
                onClick={() => {
                  handleSave(bookData).then(() => router.push('/library'));
                }}
                disabled={!bookData.title.trim()}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book Entry?</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{bookData.title}&rdquo; and its vibe collage. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
