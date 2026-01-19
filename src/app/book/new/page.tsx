'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Sparkles, BookOpen, Palette } from 'lucide-react';
import { Button, Card, CardContent, Input, Textarea, SaveIndicator } from '@/components/ui';
import { OverallMagic, CozinessLevel, MissedMyStopRisk, RereadLikelihood, Lendability } from '@/components/ratings';
import { SeasonPicker, WeatherPicker, TimeOfDayPicker, ScentTags, RoomPicker, FortuneCookie, QuoteForPillow } from '@/components/prompts';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAutoSave } from '@/hooks';
import { createBook, updateBook } from '@/lib/db';
import { useBookStore } from '@/stores/bookStore';
import { createEmptyBook, type BookRatings, type BookPrompts } from '@/types';
import { cn } from '@/lib/utils';

interface ExpandableSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function NewBookPage() {
  const router = useRouter();
  const { addBook, setIsSaving, isSaving, lastSaved, setLastSaved } = useBookStore();

  const [bookData, setBookData] = useState(createEmptyBook());
  const [bookId, setBookId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['ratings']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-save functionality
  const handleSave = useCallback(async (data: typeof bookData) => {
    if (!data.title.trim()) return;

    setIsSaving(true);
    try {
      if (bookId) {
        await updateBook(bookId, data);
      } else {
        const id = await createBook(data);
        setBookId(id);
        addBook({
          ...data,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      setLastSaved(new Date().toISOString());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [bookId, addBook, setIsSaving, setLastSaved]);

  useAutoSave({
    data: bookData,
    onSave: handleSave,
    delay: 2000,
    enabled: mounted && !!bookData.title.trim(),
  });

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

  const sections: ExpandableSection[] = [
    {
      id: 'ratings',
      title: 'Whimsical Ratings',
      icon: <Sparkles className="h-5 w-5" />,
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
      icon: <span className="text-lg">✨</span>,
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
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
              <h1 className="font-serif text-lg font-semibold">New Book Entry</h1>
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
            {bookId && (
              <Link href={`/collage/${bookId}`}>
                <Button variant="secondary">
                  <Palette className="mr-2 h-4 w-4" />
                  Create Vibe Collage
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/library">
                <Button variant="ghost">Cancel</Button>
              </Link>
              <Button
                onClick={() => {
                  handleSave(bookData).then(() => router.push('/library'));
                }}
                disabled={!bookData.title.trim()}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
