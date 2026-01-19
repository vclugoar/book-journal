import type { Sticker } from '@/types';

// SVG sticker library with inline SVG content
export const stickers: Sticker[] = [
  // Books category
  {
    id: 'book-open',
    name: 'Open Book',
    category: 'books',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M32 52V16M32 16C28 12 20 10 12 12v36c8-2 16 0 20 4M32 16c4-4 12-6 20-4v36c-8-2-16 0-20 4" stroke="#8B7355" fill="#FDF6E3"/></svg>`,
  },
  {
    id: 'book-stack',
    name: 'Book Stack',
    category: 'books',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect x="8" y="40" width="48" height="8" rx="1" fill="#D4A5A5" stroke="#8B7355" stroke-width="2"/><rect x="12" y="32" width="40" height="8" rx="1" fill="#9CAF88" stroke="#8B7355" stroke-width="2"/><rect x="10" y="24" width="44" height="8" rx="1" fill="#E6C068" stroke="#8B7355" stroke-width="2"/><rect x="14" y="16" width="36" height="8" rx="1" fill="#D4A5A5" stroke="#8B7355" stroke-width="2"/></svg>`,
  },
  {
    id: 'bookmark',
    name: 'Bookmark',
    category: 'books',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#D4A5A5" stroke="#8B7355" stroke-width="2"><path d="M20 8h24v48l-12-8-12 8V8z"/></svg>`,
  },

  // Nature category
  {
    id: 'leaf',
    name: 'Leaf',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#9CAF88" stroke="#6B5540" stroke-width="2"><path d="M32 56c0-24 16-32 24-40-8 0-24 8-24 40z M32 56c0-24-16-32-24-40 8 0 24 8 24 40z"/><path d="M32 56V24" stroke="#6B5540" stroke-width="2"/></svg>`,
  },
  {
    id: 'flower',
    name: 'Flower',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="8" fill="#E6C068"/><ellipse cx="32" cy="16" rx="8" ry="12" fill="#D4A5A5"/><ellipse cx="32" cy="48" rx="8" ry="12" fill="#D4A5A5"/><ellipse cx="16" cy="32" rx="12" ry="8" fill="#D4A5A5"/><ellipse cx="48" cy="32" rx="12" ry="8" fill="#D4A5A5"/></svg>`,
  },
  {
    id: 'tree',
    name: 'Tree',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="28" y="44" width="8" height="16" fill="#8B7355"/><path d="M32 8L12 44h40L32 8z" fill="#9CAF88" stroke="#6B5540" stroke-width="2"/></svg>`,
  },
  {
    id: 'moon',
    name: 'Moon',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M40 12a20 20 0 1 0 0 40 16 16 0 0 1 0-40z" fill="#E6C068" stroke="#D4A84A" stroke-width="2"/></svg>`,
  },
  {
    id: 'star',
    name: 'Star',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 8l6 18h18l-14 11 5 19-15-11-15 11 5-19L8 26h18z" fill="#E6C068" stroke="#D4A84A" stroke-width="2"/></svg>`,
  },

  // Cozy category
  {
    id: 'mug',
    name: 'Coffee Mug',
    category: 'cozy',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="12" y="20" width="32" height="36" rx="4" fill="#FDF6E3" stroke="#8B7355" stroke-width="2"/><path d="M44 28h8a6 6 0 0 1 0 12h-8" fill="none" stroke="#8B7355" stroke-width="2"/><path d="M20 12c4-8 8-8 12 0" stroke="#9CAF88" stroke-width="2" fill="none"/><path d="M28 12c4-8 8-8 12 0" stroke="#9CAF88" stroke-width="2" fill="none"/></svg>`,
  },
  {
    id: 'candle',
    name: 'Candle',
    category: 'cozy',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="20" y="28" width="24" height="28" rx="2" fill="#FDF6E3" stroke="#8B7355" stroke-width="2"/><path d="M32 28v-8" stroke="#8B7355" stroke-width="2"/><ellipse cx="32" cy="16" rx="4" ry="6" fill="#E6C068"/></svg>`,
  },
  {
    id: 'blanket',
    name: 'Blanket',
    category: 'cozy',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8 20h48v32c0 4-4 8-8 8H16c-4 0-8-4-8-8V20z" fill="#D4A5A5" stroke="#8B7355" stroke-width="2"/><path d="M8 20c0 8 8 12 24 12s24-4 24-12" fill="#E8C4C4" stroke="#8B7355" stroke-width="2"/></svg>`,
  },
  {
    id: 'lamp',
    name: 'Reading Lamp',
    category: 'cozy',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M24 56h16" stroke="#8B7355" stroke-width="2"/><rect x="28" y="40" width="8" height="16" fill="#8B7355"/><path d="M16 40h32l-8-24H24l-8 24z" fill="#E6C068" stroke="#D4A84A" stroke-width="2"/></svg>`,
  },

  // Weather category
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'weather',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M48 40a12 12 0 0 0-4-23 16 16 0 0 0-30 6 10 10 0 0 0 2 20h32z" fill="#FDF6E3" stroke="#D4A5A5" stroke-width="2"/></svg>`,
  },
  {
    id: 'rain',
    name: 'Rain',
    category: 'weather',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M44 32a10 10 0 0 0-3-19 13 13 0 0 0-25 5 8 8 0 0 0 2 16h26z" fill="#E8DFD0" stroke="#8B7355" stroke-width="2"/><path d="M20 40l-4 12M28 40l-4 12M36 40l-4 12M44 40l-4 12" stroke="#9CAF88" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'sun',
    name: 'Sun',
    category: 'weather',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="12" fill="#E6C068" stroke="#D4A84A" stroke-width="2"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6" stroke="#E6C068" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    category: 'weather',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" stroke="#9CAF88" stroke-width="2" fill="none"><path d="M32 8v48M8 32h48M14 14l36 36M14 50l36-36"/><path d="M32 16l-4 4 4-4 4 4M32 48l-4-4 4 4 4-4M16 32l4-4-4 4 4 4M48 32l-4-4 4 4-4 4"/></svg>`,
  },

  // Emotions category
  {
    id: 'heart',
    name: 'Heart',
    category: 'emotions',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 56L12 36c-8-8-8-20 0-28s20-8 28 0l-8 8 8-8c8-8 20-8 28 0s8 20 0 28L32 56z" fill="#D4A5A5" stroke="#B88888" stroke-width="2"/></svg>`,
  },
  {
    id: 'sparkle',
    name: 'Sparkle',
    category: 'emotions',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 8l4 20 20 4-20 4-4 20-4-20-20-4 20-4z" fill="#E6C068" stroke="#D4A84A" stroke-width="2"/></svg>`,
  },
  {
    id: 'tear',
    name: 'Tear',
    category: 'emotions',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 8c-16 20-20 32-20 40a20 20 0 0 0 40 0c0-8-4-20-20-40z" fill="#9CAF88" stroke="#7A8F68" stroke-width="2"/></svg>`,
  },

  // Decorative category
  {
    id: 'ribbon',
    name: 'Ribbon',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8 32c12-8 16-8 24 0s12 8 24 0" stroke="#D4A5A5" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'frame',
    name: 'Frame',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="4" fill="none" stroke="#8B7355" stroke-width="4"/><rect x="16" y="16" width="32" height="32" rx="2" fill="none" stroke="#D4A5A5" stroke-width="2"/></svg>`,
  },
  {
    id: 'swirl',
    name: 'Swirl',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 32c0-8 8-16 16-16s16 8 16 16-8 16-16 16-8 0-8-8 8-16 16-16" stroke="#9CAF88" stroke-width="3" fill="none"/></svg>`,
  },
  {
    id: 'dots',
    name: 'Dots',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="16" cy="32" r="4" fill="#D4A5A5"/><circle cx="32" cy="32" r="4" fill="#9CAF88"/><circle cx="48" cy="32" r="4" fill="#E6C068"/></svg>`,
  },
];

export const stickerCategories = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'nature', label: 'Nature' },
  { id: 'cozy', label: 'Cozy' },
  { id: 'weather', label: 'Weather' },
  { id: 'emotions', label: 'Emotions' },
  { id: 'decorative', label: 'Decorative' },
];

export function getStickersByCategory(category: string): Sticker[] {
  if (category === 'all') return stickers;
  return stickers.filter((s) => s.category === category);
}
