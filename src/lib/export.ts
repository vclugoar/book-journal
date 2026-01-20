import type { BookEntry, Collage } from '@/types';
import { db, bulkCreateBooks } from '@/lib/db';

// Version for backup file format
const BACKUP_VERSION = '1.0';
const APP_NAME = 'moodmark';

export interface BackupData {
  version: string;
  exportedAt: string;
  app: string;
  data: {
    books: BookEntry[];
    collages: Collage[];
  };
}

export interface CSVRow {
  title: string;
  author: string;
  dateStarted: string;
  dateFinished: string;
  overallRating: string;
  overallMagic: string;
  cozinessLevel: string;
  missedMyStopRisk: string;
  rereadLikelihood: string;
  lendability: string;
  season: string;
  timeOfDay: string;
  weather: string;
  scents: string;
  roomInHouse: string;
  notes: string;
}

/**
 * Export library as JSON (full backup)
 */
export function exportLibraryAsJSON(books: BookEntry[], collages: Collage[]): void {
  const backup: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: APP_NAME,
    data: {
      books,
      collages: collages.map((collage) => ({
        ...collage,
        // Keep canvas JSON but exclude thumbnail (blob data is large)
        thumbnail: null,
      })),
    },
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `moodmark-backup-${formatDate(new Date())}.json`);
}

/**
 * Export library as CSV (spreadsheet compatible)
 */
export function exportLibraryAsCSV(books: BookEntry[]): void {
  const headers = [
    'Title',
    'Author',
    'Date Started',
    'Date Finished',
    'Overall Rating',
    'Overall Magic',
    'Coziness Level',
    'Missed My Stop Risk',
    'Reread Likelihood',
    'Lendability',
    'Season',
    'Time of Day',
    'Weather',
    'Scents',
    'Room in House',
    'Notes',
  ];

  const rows = books.map((book) => [
    escapeCSV(book.title),
    escapeCSV(book.author),
    book.dateStarted || '',
    book.dateFinished || '',
    book.overallRating.toString(),
    book.ratings.overallMagic.toString(),
    book.ratings.cozinessLevel.toString(),
    book.ratings.missedMyStopRisk.toString(),
    book.ratings.rereadLikelihood.toString(),
    book.ratings.lendability,
    book.prompts.season || '',
    book.prompts.timeOfDay || '',
    book.prompts.weather || '',
    escapeCSV(book.prompts.scents.join(', ')),
    escapeCSV(book.prompts.roomInHouse || ''),
    escapeCSV(book.notes),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `moodmark-library-${formatDate(new Date())}.csv`);
}

/**
 * Parse and validate a backup file
 */
export function parseBackupFile(content: string): BackupData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON file. Please upload a valid Moodmark backup.');
  }

  // Validate structure
  if (!isBackupData(parsed)) {
    throw new Error('Invalid backup format. Please upload a valid Moodmark backup file.');
  }

  // Check app identifier
  if (parsed.app !== APP_NAME) {
    throw new Error('This backup is not from Moodmark. Please upload a valid Moodmark backup.');
  }

  return parsed;
}

/**
 * Import books from backup data
 */
export async function importFromBackup(
  data: BackupData,
  mode: 'merge' | 'replace'
): Promise<{ booksImported: number; collagesImported: number }> {
  if (mode === 'replace') {
    // Clear existing data
    await db.collageImages.clear();
    await db.collages.clear();
    await db.books.clear();
  }

  let booksImported = 0;
  let collagesImported = 0;

  if (mode === 'merge') {
    // Get existing book IDs to avoid duplicates
    const existingBooks = await db.books.toArray();
    const existingIds = new Set(existingBooks.map((b) => b.id));
    const existingTitles = new Set(existingBooks.map((b) => `${b.title}|${b.author}`.toLowerCase()));

    // Filter out books that already exist (by ID or title+author)
    const newBooks = data.data.books.filter((book) => {
      const key = `${book.title}|${book.author}`.toLowerCase();
      return !existingIds.has(book.id) && !existingTitles.has(key);
    });

    if (newBooks.length > 0) {
      // Use bulkCreateBooks which generates new IDs and timestamps
      const booksToCreate = newBooks.map((book) => ({
        title: book.title,
        author: book.author,
        dateStarted: book.dateStarted,
        dateFinished: book.dateFinished,
        overallRating: book.overallRating,
        ratings: book.ratings,
        prompts: book.prompts,
        coverImage: book.coverImage,
        notes: book.notes,
      }));
      await bulkCreateBooks(booksToCreate);
      booksImported = newBooks.length;
    }

    // For collages in merge mode, we only import collages for books that were newly imported
    // This is tricky because IDs change, so we skip collage import in merge mode
    // Users who want full collage restoration should use replace mode
  } else {
    // Replace mode - import everything with original IDs
    const now = new Date().toISOString();

    // Import books directly with their IDs
    for (const book of data.data.books) {
      await db.books.add({
        ...book,
        // Preserve original createdAt if present, otherwise use now
        createdAt: book.createdAt || now,
        updatedAt: now,
      });
      booksImported++;
    }

    // Import collages
    for (const collage of data.data.collages) {
      await db.collages.add({
        ...collage,
        createdAt: collage.createdAt || now,
        updatedAt: now,
      });
      collagesImported++;
    }
  }

  return { booksImported, collagesImported };
}

// Helper functions

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function escapeCSV(value: string): string {
  if (!value) return '';
  // If the value contains commas, quotes, or newlines, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function isBackupData(data: unknown): data is BackupData {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== 'string') return false;
  if (typeof obj.exportedAt !== 'string') return false;
  if (typeof obj.app !== 'string') return false;
  if (typeof obj.data !== 'object' || obj.data === null) return false;

  const dataObj = obj.data as Record<string, unknown>;

  if (!Array.isArray(dataObj.books)) return false;
  if (!Array.isArray(dataObj.collages)) return false;

  return true;
}
