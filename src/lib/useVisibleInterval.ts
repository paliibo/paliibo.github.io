"use client";

import { useEffect } from "react";

/**
 * setInterval that skips ticks while the tab is hidden. Browsers pause requestAnimationFrame in
 * background tabs, so Motion enter/exit animations would otherwise pile up until the user returns.
 */
export function useVisibleInterval(callback: () => void, ms: number, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      if (!document.hidden) callback();
    }, ms);
    return () => window.clearInterval(id);
  }, [callback, ms, enabled]);
}
