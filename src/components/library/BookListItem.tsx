'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { BookEntry } from '@/types';

interface BookListItemProps {
  book: BookEntry;
  index?: number;
}

export function BookListItem({ book, index = 0 }: BookListItemProps) {
  const magicLevel = book.ratings.overallMagic;

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
          {/* Book cover thumbnail */}
          <div
            className={cn(
              'w-12 h-16 rounded flex-shrink-0 flex items-center justify-center',
              'bg-gradient-to-br from-sage/20 via-golden/10 to-rose/20'
            )}
          >
            {book.coverImage ? (
              <img
                src={book.coverImage}
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
          </div>

          {/* Magic rating */}
          <div className="hidden sm:flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < magicLevel ? 'text-golden fill-golden' : 'text-muted'
                )}
              />
            ))}
          </div>

          {/* Date */}
          <div className="hidden md:block text-sm text-muted-foreground w-28 text-right">
            {book.dateFinished ? formatDate(book.dateFinished) : '-'}
          </div>

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}
