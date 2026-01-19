'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, List, ArrowUpDown, ChevronDown, Trash2 } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui';
import { useBookStore } from '@/stores/bookStore';
import { cn } from '@/lib/utils';
import type { SortOption } from '@/types';

interface LibraryControlsProps {
  totalBooks: number;
  onDeleteAll?: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'dateAdded', label: 'Date Added' },
  { value: 'dateFinished', label: 'Date Finished' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'rating', label: 'Magic Level' },
];

export function LibraryControls({ totalBooks, onDeleteAll }: LibraryControlsProps) {
  const { viewMode, setViewMode, filter, setSearch, setSortBy, setSortDirection } = useBookStore();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const currentSortLabel = sortOptions.find((o) => o.value === filter.sortBy)?.label || 'Date Added';

  const toggleSortDirection = () => {
    setSortDirection(filter.sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteAll = () => {
    onDeleteAll?.();
    setShowDeleteAllDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              'placeholder:text-muted-foreground'
            )}
          />
        </div>

        {/* View Toggle & Sort */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg',
                'border border-border bg-card hover:bg-muted',
                'text-sm transition-colors'
              )}
            >
              <span className="hidden sm:inline">Sort by:</span>
              <span className="font-medium">{currentSortLabel}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 py-1 w-40 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm transition-colors',
                    filter.sortBy === option.value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Direction */}
          <button
            type="button"
            onClick={toggleSortDirection}
            className={cn(
              'p-2 rounded-lg border border-border bg-card hover:bg-muted',
              'transition-colors'
            )}
            aria-label={`Sort ${filter.sortDirection === 'asc' ? 'ascending' : 'descending'}`}
          >
            <motion.div
              animate={{ rotate: filter.sortDirection === 'asc' ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpDown className="h-4 w-4" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Results count and Delete All */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalBooks} {totalBooks === 1 ? 'book' : 'books'} in your journal
        </p>
        {totalBooks > 0 && onDeleteAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteAllDialog(true)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
        )}
      </div>

      {/* Delete All Confirmation Dialog */}
      <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Books?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {totalBooks} books and their mood collages. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteAllDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAll}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
