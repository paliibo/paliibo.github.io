"use client";

import { useSyncExternalStore } from "react";

/**
 * How many bugs this visitor has fed to the chameleon, kept in localStorage so the tally survives a
 * reload and shows up in the footer. The server and the first client render see zero.
 */
const KEY = "bugs-fixed";
const listeners = new Set<() => void>();
let cache: number | null = null;

export function readBugs(): number {
  if (cache === null) {
    try {
      cache = Math.max(0, Math.floor(Number(localStorage.getItem(KEY)) || 0));
    } catch {
      cache = 0; // storage blocked: the tally lasts until the page is closed
    }
  }
  return cache;
}

/** Counts one more bug and returns the new total. */
export function addBug(): number {
  cache = readBugs() + 1;
  try {
    localStorage.setItem(KEY, String(cache));
  } catch {
    /* storage blocked */
  }
  listeners.forEach((notify) => notify());
  return cache;
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}
const serverSnapshot = () => 0;

export function useBugsFixed(): number {
  return useSyncExternalStore(subscribe, readBugs, serverSnapshot);
}
