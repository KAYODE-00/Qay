import { useCallback, useEffect, useRef } from 'react';

interface UseCanvasPanOptions {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  iframeElement: HTMLIFrameElement | null;
  enabled?: boolean;
  isTextEditing?: boolean;
}

interface UseCanvasPanResult {
  isPanGestureActive: () => boolean;
}

export function useCanvasPan({
  scrollContainerRef,
  iframeElement,
  enabled = true,
  isTextEditing = false,
}: UseCanvasPanOptions): UseCanvasPanResult {
  const stateRef = useRef({
    isPanning: false,
    spaceHeld: false,
    overCanvas: false,
    suppressNextClick: false,
    lastX: 0,
    lastY: 0,
  });
  const isTextEditingRef = useRef(isTextEditing);

  useEffect(() => {
    isTextEditingRef.current = isTextEditing;
  }, [isTextEditing]);

  useEffect(() => {
    if (!enabled) return;

    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const state = stateRef.current;

    let iframeDoc: Document | null = null;
    try {
      iframeDoc = iframeElement?.contentDocument ?? null;
    } catch {
      iframeDoc = null;
    }

    const setCursor = (mode: 'grab' | 'grabbing' | '') => {
      scrollEl.style.cursor = mode;
      if (iframeElement) iframeElement.style.cursor = mode;
      try {
        if (iframeDoc?.body) iframeDoc.body.style.cursor = mode;
      } catch {
        // Ignore cross-context cursor failures.
      }
    };

    const shouldStartPan = (event: MouseEvent) =>
      event.button === 1 || (event.button === 0 && state.spaceHeld);

    const handleMove = (event: MouseEvent) => {
      if (!state.isPanning) return;
      event.preventDefault();

      const dx = event.screenX - state.lastX;
      const dy = event.screenY - state.lastY;
      state.lastX = event.screenX;
      state.lastY = event.screenY;

      scrollEl.scrollLeft -= dx;

      let scroller: Element | null = null;
      try {
        scroller = iframeDoc?.scrollingElement ?? iframeDoc?.documentElement ?? null;
      } catch {
        scroller = null;
      }

      if (scroller && scroller.scrollHeight > scroller.clientHeight) {
        scroller.scrollTop -= dy;
      } else {
        scrollEl.scrollTop -= dy;
      }
    };

    const endPan = () => {
      if (!state.isPanning) return;
      state.isPanning = false;
      setCursor(state.spaceHeld ? 'grab' : '');
      window.removeEventListener('mousemove', handleMove, true);
      window.removeEventListener('mouseup', endPan, true);
      try {
        iframeDoc?.removeEventListener('mousemove', handleMove, true);
        iframeDoc?.removeEventListener('mouseup', endPan, true);
      } catch {
        // Ignore.
      }
      setTimeout(() => {
        state.suppressNextClick = false;
      }, 0);
    };

    const handleClick = (event: MouseEvent) => {
      if (!state.spaceHeld && !state.suppressNextClick) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const startPan = (event: MouseEvent) => {
      if (state.isPanning || !shouldStartPan(event)) return;
      event.preventDefault();
      event.stopPropagation();
      state.isPanning = true;
      state.suppressNextClick = true;
      state.lastX = event.screenX;
      state.lastY = event.screenY;
      setCursor('grabbing');

      window.addEventListener('mousemove', handleMove, true);
      window.addEventListener('mouseup', endPan, true);
      try {
        iframeDoc?.addEventListener('mousemove', handleMove, true);
        iframeDoc?.addEventListener('mouseup', endPan, true);
      } catch {
        // Ignore.
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat || state.spaceHeld) return;
      if (isTextEditingRef.current || !state.overCanvas) return;
      state.spaceHeld = true;
      event.preventDefault();
      if (!state.isPanning) setCursor('grab');
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      state.spaceHeld = false;
      if (!state.isPanning) setCursor('');
    };

    const markOver = () => {
      state.overCanvas = true;
    };
    const markOut = () => {
      state.overCanvas = false;
    };

    scrollEl.addEventListener('mousedown', startPan, true);
    scrollEl.addEventListener('click', handleClick, true);
    scrollEl.addEventListener('mouseenter', markOver);
    scrollEl.addEventListener('mousemove', markOver);
    scrollEl.addEventListener('mouseleave', markOut);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    try {
      iframeDoc?.addEventListener('mousedown', startPan, true);
      iframeDoc?.addEventListener('click', handleClick, true);
      iframeDoc?.addEventListener('mousemove', markOver);
      iframeDoc?.addEventListener('keydown', handleKeyDown, true);
      iframeDoc?.addEventListener('keyup', handleKeyUp, true);
    } catch {
      // Ignore.
    }

    return () => {
      scrollEl.removeEventListener('mousedown', startPan, true);
      scrollEl.removeEventListener('click', handleClick, true);
      scrollEl.removeEventListener('mouseenter', markOver);
      scrollEl.removeEventListener('mousemove', markOver);
      scrollEl.removeEventListener('mouseleave', markOut);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      try {
        iframeDoc?.removeEventListener('mousedown', startPan, true);
        iframeDoc?.removeEventListener('click', handleClick, true);
        iframeDoc?.removeEventListener('mousemove', markOver);
        iframeDoc?.removeEventListener('keydown', handleKeyDown, true);
        iframeDoc?.removeEventListener('keyup', handleKeyUp, true);
      } catch {
        // Ignore.
      }
      endPan();
      state.spaceHeld = false;
      state.overCanvas = false;
      setCursor('');
    };
  }, [enabled, scrollContainerRef, iframeElement]);

  const isPanGestureActive = useCallback(() => {
    const state = stateRef.current;
    return state.spaceHeld || state.isPanning || state.suppressNextClick;
  }, []);

  return { isPanGestureActive };
}
