// Book Entry Types
export interface BookRatings {
  overallMagic: number; // 1-5 sparkles
  cozinessLevel: number; // 0-100 warmth meter
  missedMyStopRisk: number; // 0-100 risk slider
  rereadLikelihood: number; // 0-5 book stack
  lendability: 'keep' | 'lend-reluctantly' | 'lend-freely' | 'gift';
}

export interface BookPrompts {
  season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight' | null;
  scents: string[];
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy' | null;
  suitcaseItems: string[];
  roomInHouse: string | null;
  fortuneCookieMessage: string | null;
  quoteForPillow: string | null;
  readingLocation: string | null;
}

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  dateStarted: string | null;
  dateFinished: string | null;
  overallRating: number; // 0-5 stars (regular rating)
  ratings: BookRatings; // Whimsical ratings
  prompts: BookPrompts;
  coverImage: string | null; // Base64 or blob URL
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Collage Types
export interface Collage {
  id: string;
  bookId: string;
  canvasJSON: string; // Fabric.js serialized state
  thumbnail: string | null; // Base64 thumbnail
  colorPalette: string[]; // Array of hex colors
  createdAt: string;
  updatedAt: string;
}

export interface CollageImage {
  id: string;
  collageId: string;
  imageData: Blob;
  filename: string;
  mimeType: string;
}

// UI Types
export type ViewMode = 'grid' | 'list';
export type SortOption = 'dateAdded' | 'dateFinished' | 'title' | 'author' | 'rating';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
}

// Sticker Types
export interface Sticker {
  id: string;
  name: string;
  category: 'books' | 'nature' | 'cozy' | 'weather' | 'emotions' | 'decorative';
  svg: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Default Values
export const defaultRatings: BookRatings = {
  overallMagic: 0,
  cozinessLevel: 50,
  missedMyStopRisk: 50,
  rereadLikelihood: 0,
  lendability: 'lend-reluctantly',
};

export const defaultPrompts: BookPrompts = {
  season: null,
  timeOfDay: null,
  scents: [],
  weather: null,
  suitcaseItems: [],
  roomInHouse: null,
  fortuneCookieMessage: null,
  quoteForPillow: null,
  readingLocation: null,
};

export const createEmptyBook = (): Omit<BookEntry, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  author: '',
  dateStarted: null,
  dateFinished: null,
  overallRating: 0,
  ratings: { ...defaultRatings },
  prompts: { ...defaultPrompts },
  coverImage: null,
  notes: '',
});
