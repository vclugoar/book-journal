'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Sparkles, BookOpen, Trash2 } from 'lucide-react';
import { Card, Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui';
import { formatDate, getBookPersonality, cn } from '@/lib/utils';
import type { BookEntry } from '@/types';

interface BookCardProps {
  book: BookEntry;
  index?: number;
  collageThumbnail?: string | null;
  onDelete?: (id: string) => void;
}

export function BookCard({ book, index = 0, collageThumbnail, onDelete }: BookCardProps) {
  const rating = book.overallRating ?? 0;
  const magicLevel = book.ratings?.overallMagic ?? 0;
  const personality = book.prompts ? getBookPersonality(book.prompts) : null;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Prefer collage thumbnail over book cover
  const displayImage = collageThumbnail || book.coverImage;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete?.(book.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link href={`/book/${book.id}`}>
          <Card interactive className="h-full p-5 group relative">
          {/* Collage thumbnail or book cover */}
          <div
            className={cn(
              'h-32 rounded-lg mb-4 flex items-center justify-center overflow-hidden',
              'bg-gradient-to-br from-sage/20 via-golden/10 to-rose/20',
              'group-hover:from-sage/30 group-hover:via-golden/20 group-hover:to-rose/30',
              'transition-all duration-300'
            )}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={book.title}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <BookOpen className="h-12 w-12 text-muted-foreground/30" />
            )}
          </div>

          {/* Book info */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>

            {/* Star rating */}
            <div className="flex items-center gap-0.5 pt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4 transition-colors',
                    i < rating ? 'text-primary fill-primary' : 'text-muted'
                  )}
                />
              ))}
            </div>

            {/* Whimsical rating (Magic Level) */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              {magicLevel > 0 ? (
                <span>{magicLevel}/5 magic</span>
              ) : (
                <span className="italic">No sparkle yet</span>
              )}
            </div>

            {/* Book Personality Chip */}
            {personality && (
              <div className="pt-1">
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                  {personality}
                </span>
              </div>
            )}

            {/* Date */}
            {book.dateFinished && (
              <p className="text-xs text-muted-foreground">
                Finished {formatDate(book.dateFinished)}
              </p>
            )}
          </div>

            {/* Delete button */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className={cn(
                  'absolute top-3 right-3 p-1.5 rounded-md',
                  'bg-background/80 opacity-0 group-hover:opacity-100',
                  'hover:bg-destructive hover:text-destructive-foreground',
                  'transition-all duration-200'
                )}
                aria-label="Delete book"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </Card>
        </Link>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book?</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{book.title}&rdquo; and its mood collage. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
