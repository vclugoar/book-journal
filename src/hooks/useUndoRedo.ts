'use client';

import { useCallback, useEffect } from 'react';
import { useCollageStore } from '@/stores/collageStore';

interface UseUndoRedoOptions {
  onUndo?: (state: string) => void;
  onRedo?: (state: string) => void;
  enabled?: boolean;
}

export function useUndoRedo({ onUndo, onRedo, enabled = true }: UseUndoRedoOptions = {}) {
  const { undo, redo, canUndo, canRedo, pushHistory } = useCollageStore();

  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState && onUndo) {
      onUndo(previousState);
    }
  }, [undo, onUndo]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState && onRedo) {
      onRedo(nextState);
    }
  }, [redo, onRedo]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      if (isMod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleUndo, handleRedo]);

  return {
    undo: handleUndo,
    redo: handleRedo,
    canUndo: canUndo(),
    canRedo: canRedo(),
    pushHistory,
  };
}
