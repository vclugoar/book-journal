import Dexie, { type EntityTable } from 'dexie';
import type { BookEntry, Collage, CollageImage } from '@/types';

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
