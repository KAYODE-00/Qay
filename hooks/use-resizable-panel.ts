'use client';

import { useCallback, useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';

type ResizeDirection = 'left' | 'right';

interface UseResizablePanelOptions {
  storageKey: string;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  direction: ResizeDirection;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function useResizablePanel({
  storageKey,
  defaultWidth,
  minWidth,
  maxWidth,
  direction,
}: UseResizablePanelOptions) {
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return defaultWidth;

    try {
      const savedWidth = window.localStorage.getItem(storageKey);
      if (!savedWidth) return defaultWidth;

      const parsedWidth = Number(savedWidth);
      if (Number.isFinite(parsedWidth)) {
        return clamp(parsedWidth, minWidth, maxWidth);
      }
    } catch {
      // Keep the default width when storage is unavailable.
    }

    return defaultWidth;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, String(width));
    } catch {
      // Resizing should still work if storage is unavailable.
    }
  }, [storageKey, width]);

  const startResize = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;

    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const delta = direction === 'right'
        ? moveEvent.clientX - startX
        : startX - moveEvent.clientX;

      setWidth(clamp(startWidth + delta, minWidth, maxWidth));
    };

    const stopResize = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', stopResize);
      document.removeEventListener('pointercancel', stopResize);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', stopResize);
    document.addEventListener('pointercancel', stopResize);
  }, [direction, maxWidth, minWidth, width]);

  return { width, startResize };
}
