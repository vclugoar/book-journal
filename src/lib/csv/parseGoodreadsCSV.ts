import { defaultRatings, defaultPrompts, type BookEntry } from '@/types';

export interface GoodreadsBook {
  title: string;
  author: string;
  myRating: number;
  dateRead: string | null;
  dateAdded: string | null;
  exclusiveShelf: 'read' | 'to-read' | 'currently-reading' | string;
}

/**
 * Parse a CSV string into an array of rows.
 * Handles quoted fields with commas and newlines.
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Parse CSV text into rows, handling multi-line quoted fields.
 */
function parseCSVText(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.split(/\r?\n/);
  let currentRow = '';
  let inQuotes = false;

  for (const line of lines) {
    if (!line && !inQuotes) continue;

    currentRow += (currentRow ? '\n' : '') + line;

    // Count quotes to determine if we're inside a quoted field
    const quoteCount = (line.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      inQuotes = !inQuotes;
    }

    if (!inQuotes) {
      rows.push(parseCSVRow(currentRow));
      currentRow = '';
    }
  }

  return rows;
}

/**
 * Parse a date string from Goodreads format (YYYY/MM/DD) to ISO format.
 */
function parseGoodreadsDate(dateStr: string | undefined): string | null {
  if (!dateStr || dateStr.trim() === '') return null;

  // Goodreads uses YYYY/MM/DD format
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;
  if (!year || !month || !day) return null;

  // Validate parts are numbers
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;

  // Return ISO date string
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Parse Goodreads CSV export text into an array of GoodreadsBook objects.
 */
export function parseGoodreadsCSV(csvText: string): GoodreadsBook[] {
  const rows = parseCSVText(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().trim());

  // Find column indices for the fields we need
  const titleIndex = headers.indexOf('title');
  const authorIndex = headers.indexOf('author');
  const myRatingIndex = headers.indexOf('my rating');
  const dateReadIndex = headers.indexOf('date read');
  const dateAddedIndex = headers.indexOf('date added');
  const exclusiveShelfIndex = headers.indexOf('exclusive shelf');

  if (titleIndex === -1 || authorIndex === -1) {
    throw new Error('CSV missing required columns: Title and Author');
  }

  const books: GoodreadsBook[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const title = row[titleIndex]?.trim();
    const author = row[authorIndex]?.trim();

    // Skip rows without title or author
    if (!title || !author) continue;

    const myRating = myRatingIndex !== -1 ? parseInt(row[myRatingIndex], 10) || 0 : 0;
    const dateRead = dateReadIndex !== -1 ? parseGoodreadsDate(row[dateReadIndex]) : null;
    const dateAdded = dateAddedIndex !== -1 ? parseGoodreadsDate(row[dateAddedIndex]) : null;
    const exclusiveShelf = exclusiveShelfIndex !== -1 ? row[exclusiveShelfIndex]?.trim().toLowerCase() || 'unknown' : 'unknown';

    books.push({
      title,
      author,
      myRating,
      dateRead,
      dateAdded,
      exclusiveShelf,
    });
  }

  return books;
}

/**
 * Map a GoodreadsBook to a BookEntry (without id, createdAt, updatedAt).
 */
export function mapToBookEntry(
  grBook: GoodreadsBook
): Omit<BookEntry, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: grBook.title,
    author: grBook.author,
    dateStarted: grBook.dateAdded,
    dateFinished: grBook.dateRead,
    ratings: {
      ...defaultRatings,
      overallMagic: grBook.myRating,
    },
    prompts: { ...defaultPrompts },
    coverImage: null,
    notes: '',
  };
}
