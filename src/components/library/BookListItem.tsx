'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Sparkles, BookOpen, ChevronRight, Trash2 } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui';
import { formatDate, getBookPersonality, cn } from '@/lib/utils';
import type { BookEntry } from '@/types';

interface BookListItemProps {
  book: BookEntry;
  index?: number;
  collageThumbnail?: string | null;
  onDelete?: (id: string) => void;
}

export function BookListItem({ book, index = 0, collageThumbnail, onDelete }: BookListItemProps) {
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link href={`/book/${book.id}`}>
        <div
          className={cn(
            'flex items-center gap-4 p-4 rounded-lg',
            'bg-card hover:bg-muted/50',
            'border border-transparent hover:border-border',
            'transition-all duration-200 group'
          )}
        >
          {/* Collage thumbnail or book cover */}
          <div
            className={cn(
              'w-12 h-16 rounded flex-shrink-0 flex items-center justify-center overflow-hidden',
              'bg-gradient-to-br from-sage/20 via-golden/10 to-rose/20'
            )}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={book.title}
                className="h-full w-full object-cover rounded"
              />
            ) : (
              <BookOpen className="h-5 w-5 text-muted-foreground/30" />
            )}
          </div>

          {/* Book info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold truncate group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{book.author}</p>
            {personality && (
              <span className="inline-block text-xs px-2 py-0.5 mt-1 rounded-full bg-muted/50 text-muted-foreground">
                {personality}
              </span>
            )}
          </div>

          {/* Star rating */}
          <div className="hidden sm:flex items-center gap-0.5 w-24 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < rating ? 'text-primary fill-primary' : 'text-muted'
                )}
              />
            ))}
          </div>

          {/* Whimsical rating (Magic Level) */}
          <div className="hidden sm:flex items-center gap-1 w-20 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {magicLevel > 0 ? (
              <span>{magicLevel}/5</span>
            ) : (
              <span className="italic">No sparkle yet</span>
            )}
          </div>

          {/* Date */}
          <div className="hidden md:block text-sm text-muted-foreground w-28 text-right">
            {book.dateFinished ? formatDate(book.dateFinished) : '-'}
          </div>

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              className={cn(
                'p-1.5 rounded-md opacity-0 group-hover:opacity-100',
                'hover:bg-destructive hover:text-destructive-foreground',
                'transition-all duration-200'
              )}
              aria-label="Delete book"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
      </Link>

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
    </motion.div>
  );
}
