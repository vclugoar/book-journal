import Dexie, { type EntityTable } from 'dexie';
import type { BookEntry, Collage, CollageImage } from '@/types';
import { createClient } from '@/lib/supabase/client';

// Database schema
const db = new Dexie('ReadingJournalDB') as Dexie & {
  books: EntityTable<BookEntry, 'id'>;
  collages: EntityTable<Collage, 'id'>;
  collageImages: EntityTable<CollageImage, 'id'>;
};

// Schema version 1
db.version(1).stores({
  books: 'id, title, author, dateStarted, dateFinished, createdAt, updatedAt',
  collages: 'id, bookId, createdAt, updatedAt',
  collageImages: 'id, collageId',
});

export { db };

// Database helper functions
export async function createBook(book: Omit<BookEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  await db.books.add({
    ...book,
    id,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updateBook(id: string, updates: Partial<BookEntry>): Promise<void> {
  await db.books.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteBook(id: string): Promise<void> {
  // Delete associated collages and images
  const collages = await db.collages.where('bookId').equals(id).toArray();
  for (const collage of collages) {
    await db.collageImages.where('collageId').equals(collage.id).delete();
  }
  await db.collages.where('bookId').equals(id).delete();
  await db.books.delete(id);
}

export async function deleteAllBooks(): Promise<void> {
  // Delete all collage images first
  await db.collageImages.clear();
  // Delete all collages
  await db.collages.clear();
  // Delete all books
  await db.books.clear();
}

export async function getBook(id: string): Promise<BookEntry | undefined> {
  return db.books.get(id);
}

export async function getAllBooks(): Promise<BookEntry[]> {
  return db.books.orderBy('updatedAt').reverse().toArray();
}

export async function bulkCreateBooks(
  books: Omit<BookEntry, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<string[]> {
  const now = new Date().toISOString();
  const booksWithMetadata = books.map((book) => ({
    ...book,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.books.bulkAdd(booksWithMetadata);

  return booksWithMetadata.map((book) => book.id);
}

export async function createCollage(bookId: string): Promise<string> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  await db.collages.add({
    id,
    bookId,
    canvasJSON: '',
    thumbnail: null,
    colorPalette: ['#FDF6E3', '#D4A5A5', '#9CAF88', '#E6C068', '#8B7355'],
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

export async function updateCollage(id: string, updates: Partial<Collage>): Promise<void> {
  await db.collages.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCollageByBookId(bookId: string): Promise<Collage | undefined> {
  return db.collages.where('bookId').equals(bookId).first();
}

export async function getAllCollages(): Promise<Collage[]> {
  return db.collages.toArray();
}

export async function addCollageImage(collageId: string, imageData: Blob, filename: string): Promise<string> {
  const id = crypto.randomUUID();

  await db.collageImages.add({
    id,
    collageId,
    imageData,
    filename,
    mimeType: imageData.type,
  });

  return id;
}

export async function getCollageImages(collageId: string): Promise<CollageImage[]> {
  return db.collageImages.where('collageId').equals(collageId).toArray();
}

export async function deleteCollageImage(id: string): Promise<void> {
  await db.collageImages.delete(id);
}

// ============================================
// Supabase Sync Functions
// ============================================

interface SupabaseBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover_image: string | null;
  date_started: string | null;
  date_finished: string | null;
  overall_rating: number;
  ratings: BookEntry['ratings'];
  prompts: BookEntry['prompts'];
  notes: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseCollage {
  id: string;
  user_id: string;
  book_id: string;
  canvas_data: string;
  thumbnail: string | null;
  template: string | null;
  background_color: string;
  created_at: string;
  updated_at: string;
}

// Convert local BookEntry to Supabase format
function toSupabaseBook(book: BookEntry, userId: string): Omit<SupabaseBook, 'created_at'> {
  return {
    id: book.id,
    user_id: userId,
    title: book.title,
    author: book.author,
    cover_image: book.coverImage,
    date_started: book.dateStarted,
    date_finished: book.dateFinished,
    overall_rating: book.overallRating,
    ratings: book.ratings,
    prompts: book.prompts,
    notes: book.notes,
    updated_at: book.updatedAt,
  };
}

// Convert Supabase book to local BookEntry format
function fromSupabaseBook(book: SupabaseBook): BookEntry {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverImage: book.cover_image,
    dateStarted: book.date_started,
    dateFinished: book.date_finished,
    overallRating: book.overall_rating,
    ratings: book.ratings,
    prompts: book.prompts,
    notes: book.notes,
    createdAt: book.created_at,
    updatedAt: book.updated_at,
  };
}

// Convert local Collage to Supabase format
function toSupabaseCollage(collage: Collage, userId: string): Omit<SupabaseCollage, 'created_at'> {
  return {
    id: collage.id,
    user_id: userId,
    book_id: collage.bookId,
    canvas_data: collage.canvasJSON,
    thumbnail: collage.thumbnail,
    template: null,
    background_color: collage.colorPalette?.[0] || '#faf5e6',
    updated_at: collage.updatedAt,
  };
}

// Convert Supabase collage to local Collage format
function fromSupabaseCollage(collage: SupabaseCollage): Collage {
  return {
    id: collage.id,
    bookId: collage.book_id,
    canvasJSON: collage.canvas_data || '',
    thumbnail: collage.thumbnail,
    colorPalette: [collage.background_color],
    createdAt: collage.created_at,
    updatedAt: collage.updated_at,
  };
}

// Sync books to Supabase
export async function syncBooksToSupabase(userId: string): Promise<void> {
  const supabase = createClient();
  const localBooks = await getAllBooks();

  for (const book of localBooks) {
    const supabaseBook = toSupabaseBook(book, userId);

    const { error } = await supabase
      .from('books')
      .upsert(supabaseBook, { onConflict: 'id' });

    if (error) {
      console.error('Error syncing book to Supabase:', error);
    }
  }
}

// Sync books from Supabase to local
export async function syncBooksFromSupabase(userId: string): Promise<BookEntry[]> {
  const supabase = createClient();

  const { data: supabaseBooks, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching books from Supabase:', error);
    return [];
  }

  const books = (supabaseBooks as SupabaseBook[]).map(fromSupabaseBook);

  // Update local IndexedDB
  for (const book of books) {
    const existingBook = await db.books.get(book.id);
    if (!existingBook || new Date(book.updatedAt) > new Date(existingBook.updatedAt)) {
      await db.books.put(book);
    }
  }

  return books;
}

// Sync collages to Supabase
export async function syncCollagesToSupabase(userId: string): Promise<void> {
  const supabase = createClient();
  const localCollages = await getAllCollages();

  for (const collage of localCollages) {
    const supabaseCollage = toSupabaseCollage(collage, userId);

    const { error } = await supabase
      .from('collages')
      .upsert(supabaseCollage, { onConflict: 'id' });

    if (error) {
      console.error('Error syncing collage to Supabase:', error);
    }
  }
}

// Sync collages from Supabase to local
export async function syncCollagesFromSupabase(userId: string): Promise<Collage[]> {
  const supabase = createClient();

  const { data: supabaseCollages, error } = await supabase
    .from('collages')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching collages from Supabase:', error);
    return [];
  }

  const collages = (supabaseCollages as SupabaseCollage[]).map(fromSupabaseCollage);

  // Update local IndexedDB
  for (const collage of collages) {
    const existingCollage = await db.collages.get(collage.id);
    if (!existingCollage || new Date(collage.updatedAt) > new Date(existingCollage.updatedAt)) {
      await db.collages.put(collage);
    }
  }

  return collages;
}

// Full bidirectional sync
export async function syncWithCloud(userId: string): Promise<{ books: BookEntry[], collages: Collage[] }> {
  // First, push local changes to cloud
  await syncBooksToSupabase(userId);
  await syncCollagesToSupabase(userId);

  // Then, pull cloud changes to local
  const books = await syncBooksFromSupabase(userId);
  const collages = await syncCollagesFromSupabase(userId);

  return { books, collages };
}

// Save book to both local and cloud
export async function saveBookWithSync(
  book: Omit<BookEntry, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string | null
): Promise<string> {
  const id = await createBook(book);

  if (userId) {
    const savedBook = await getBook(id);
    if (savedBook) {
      const supabase = createClient();
      const { error } = await supabase
        .from('books')
        .insert(toSupabaseBook(savedBook, userId));

      if (error) {
        console.error('Error saving book to Supabase:', error);
      }
    }
  }

  return id;
}

// Update book in both local and cloud
export async function updateBookWithSync(
  id: string,
  updates: Partial<BookEntry>,
  userId: string | null
): Promise<void> {
  await updateBook(id, updates);

  if (userId) {
    const updatedBook = await getBook(id);
    if (updatedBook) {
      const supabase = createClient();
      const { error } = await supabase
        .from('books')
        .upsert(toSupabaseBook(updatedBook, userId), { onConflict: 'id' });

      if (error) {
        console.error('Error updating book in Supabase:', error);
      }
    }
  }
}

// Delete book from both local and cloud
export async function deleteBookWithSync(id: string, userId: string | null): Promise<void> {
  await deleteBook(id);

  if (userId) {
    const supabase = createClient();
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting book from Supabase:', error);
    }
  }
}

// Import local books to cloud on first login
export async function importLocalBooksToCloud(userId: string): Promise<number> {
  const localBooks = await getAllBooks();
  let imported = 0;

  const supabase = createClient();

  for (const book of localBooks) {
    const supabaseBook = {
      ...toSupabaseBook(book, userId),
      created_at: book.createdAt,
    };

    const { error } = await supabase
      .from('books')
      .upsert(supabaseBook, { onConflict: 'id' });

    if (!error) {
      imported++;
    }
  }

  // Also import collages
  const localCollages = await getAllCollages();
  for (const collage of localCollages) {
    const supabaseCollage = {
      ...toSupabaseCollage(collage, userId),
      created_at: collage.createdAt,
    };

    await supabase
      .from('collages')
      .upsert(supabaseCollage, { onConflict: 'id' });
  }

  return imported;
}
