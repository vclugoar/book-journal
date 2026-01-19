'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { BookEntry } from '@/types';

interface BookCardProps {
  book: BookEntry;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const magicLevel = book.ratings.overallMagic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/book/${book.id}`}>
        <Card interactive className="h-full p-5 group">
          {/* Book cover placeholder or image */}
          <div
            className={cn(
              'h-32 rounded-lg mb-4 flex items-center justify-center',
              'bg-gradient-to-br from-sage/20 via-golden/10 to-rose/20',
              'group-hover:from-sage/30 group-hover:via-golden/20 group-hover:to-rose/30',
              'transition-all duration-300'
            )}
          >
            {book.coverImage ? (
              <img
                src={book.coverImage}
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

            {/* Magic rating */}
            <div className="flex items-center gap-1 pt-2">
              {[...Array(5)].map((_, i) => (
                <Sparkles
                  key={i}
                  className={cn(
                    'h-4 w-4 transition-colors',
                    i < magicLevel ? 'text-golden fill-golden' : 'text-muted'
                  )}
                />
              ))}
            </div>

            {/* Date */}
            {book.dateFinished && (
              <p className="text-xs text-muted-foreground">
                Finished {formatDate(book.dateFinished)}
              </p>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
