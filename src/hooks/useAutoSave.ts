'use client';

import { useEffect, useRef, useCallback } from 'react';
import { debounce } from '@/lib/utils';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const previousDataRef = useRef<string>();
  const isSavingRef = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (dataToSave: T) => {
      if (isSavingRef.current) return;

      try {
        isSavingRef.current = true;
        await onSave(dataToSave);
      } finally {
        isSavingRef.current = false;
      }
    }, delay),
    [onSave, delay]
  );

  useEffect(() => {
    if (!enabled) return;

    const serialized = JSON.stringify(data);

    // Only save if data has changed
    if (serialized !== previousDataRef.current) {
      previousDataRef.current = serialized;
      debouncedSave(data);
    }
  }, [data, debouncedSave, enabled]);

  const saveNow = useCallback(async () => {
    if (isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      await onSave(data);
      previousDataRef.current = JSON.stringify(data);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave]);

  return { saveNow };
}
