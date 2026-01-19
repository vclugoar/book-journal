import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BookEntry, FilterState, SortOption, SortDirection, ViewMode } from '@/types';

interface BookStore {
  // State
  books: BookEntry[];
  currentBookId: string | null;
  viewMode: ViewMode;
  filter: FilterState;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: string | null;

  // Actions
  setBooks: (books: BookEntry[]) => void;
  addBook: (book: BookEntry) => void;
  updateBook: (id: string, updates: Partial<BookEntry>) => void;
  removeBook: (id: string) => void;
  setCurrentBookId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (timestamp: string | null) => void;

  // Computed
  getFilteredBooks: () => BookEntry[];
  getCurrentBook: () => BookEntry | undefined;
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      // Initial state
      books: [],
      currentBookId: null,
      viewMode: 'grid',
      filter: {
        search: '',
        sortBy: 'dateAdded',
        sortDirection: 'desc',
      },
      isLoading: false,
      isSaving: false,
      lastSaved: null,

      // Actions
      setBooks: (books) => set({ books }),

      addBook: (book) => set((state) => ({
        books: [book, ...state.books]
      })),

      updateBook: (id, updates) => set((state) => ({
        books: state.books.map((book) =>
          book.id === id ? { ...book, ...updates, updatedAt: new Date().toISOString() } : book
        ),
      })),

      removeBook: (id) => set((state) => ({
        books: state.books.filter((book) => book.id !== id),
        currentBookId: state.currentBookId === id ? null : state.currentBookId,
      })),

      setCurrentBookId: (id) => set({ currentBookId: id }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSearch: (search) => set((state) => ({
        filter: { ...state.filter, search },
      })),

      setSortBy: (sortBy) => set((state) => ({
        filter: { ...state.filter, sortBy },
      })),

      setSortDirection: (direction) => set((state) => ({
        filter: { ...state.filter, sortDirection: direction },
      })),

      setIsLoading: (loading) => set({ isLoading: loading }),

      setIsSaving: (saving) => set({ isSaving: saving }),

      setLastSaved: (timestamp) => set({ lastSaved: timestamp }),

      // Computed
      getFilteredBooks: () => {
        const { books, filter } = get();
        let filtered = [...books];

        // Apply search filter
        if (filter.search) {
          const search = filter.search.toLowerCase();
          filtered = filtered.filter(
            (book) =>
              book.title.toLowerCase().includes(search) ||
              book.author.toLowerCase().includes(search)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (filter.sortBy) {
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'author':
              comparison = a.author.localeCompare(b.author);
              break;
            case 'dateFinished':
              const dateA = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
              const dateB = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;
              comparison = dateA - dateB;
              break;
            case 'rating':
              comparison = (a.overallRating ?? 0) - (b.overallRating ?? 0);
              break;
            case 'dateAdded':
            default:
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }

          return filter.sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      getCurrentBook: () => {
        const { books, currentBookId } = get();
        return books.find((book) => book.id === currentBookId);
      },
    }),
    {
      name: 'book-journal-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        filter: state.filter,
      }),
    }
  )
);
