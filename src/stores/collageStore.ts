import { create } from 'zustand';
import type { Collage } from '@/types';

interface HistoryState {
  past: string[];
  future: string[];
}

interface CollageStore {
  // State
  currentCollage: Collage | null;
  history: HistoryState;
  selectedObjectId: string | null;
  isSaving: boolean;
  lastSaved: string | null;
  activeTool: 'select' | 'text' | 'draw';
  stickerCategory: string;

  // Actions
  setCurrentCollage: (collage: Collage | null) => void;
  updateCanvasJSON: (json: string) => void;
  setSelectedObjectId: (id: string | null) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (timestamp: string | null) => void;
  setActiveTool: (tool: 'select' | 'text' | 'draw') => void;
  setStickerCategory: (category: string) => void;

  // History
  pushHistory: (canvasJSON: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

const MAX_HISTORY = 50;

export const useCollageStore = create<CollageStore>()((set, get) => ({
  // Initial state
  currentCollage: null,
  history: {
    past: [],
    future: [],
  },
  selectedObjectId: null,
  isSaving: false,
  lastSaved: null,
  activeTool: 'select',
  stickerCategory: 'all',

  // Actions
  setCurrentCollage: (collage) => set({
    currentCollage: collage,
    history: { past: [], future: [] },
  }),

  updateCanvasJSON: (json) => set((state) => ({
    currentCollage: state.currentCollage
      ? { ...state.currentCollage, canvasJSON: json, updatedAt: new Date().toISOString() }
      : null,
  })),

  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  setIsSaving: (saving) => set({ isSaving: saving }),

  setLastSaved: (timestamp) => set({ lastSaved: timestamp }),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setStickerCategory: (category) => set({ stickerCategory: category }),

  // History management
  pushHistory: (canvasJSON) => set((state) => {
    const newPast = [...state.history.past, canvasJSON].slice(-MAX_HISTORY);
    return {
      history: {
        past: newPast,
        future: [], // Clear future when new action is performed
      },
    };
  }),

  undo: () => {
    const { history, currentCollage } = get();
    if (history.past.length === 0 || !currentCollage) return null;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    set({
      history: {
        past: newPast,
        future: [currentCollage.canvasJSON, ...history.future],
      },
      currentCollage: {
        ...currentCollage,
        canvasJSON: previous,
      },
    });

    return previous;
  },

  redo: () => {
    const { history, currentCollage } = get();
    if (history.future.length === 0 || !currentCollage) return null;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      history: {
        past: [...history.past, currentCollage.canvasJSON],
        future: newFuture,
      },
      currentCollage: {
        ...currentCollage,
        canvasJSON: next,
      },
    });

    return next;
  },

  canUndo: () => get().history.past.length > 0,

  canRedo: () => get().history.future.length > 0,

  clearHistory: () => set({
    history: { past: [], future: [] },
  }),
}));
