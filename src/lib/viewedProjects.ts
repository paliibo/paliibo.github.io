"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Which project cards this visitor has opened, kept in localStorage so the "Viewed" marks survive a
 * reload. A tiny external store: the server and the first client render see an empty set, so the
 * static HTML always matches.
 */
const KEY = "viewed-projects";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  if (cache === null) {
    try {
      cache = localStorage.getItem(KEY) ?? "";
    } catch {
      cache = ""; // storage blocked: marks last until the page is closed
    }
  }
  return cache;
}

function write(value: string) {
  cache = value;
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

const serverSnapshot = () => "";

export function useViewedProjects(): ReadonlySet<string> {
  const raw = useSyncExternalStore(subscribe, read, serverSnapshot);
  return useMemo(() => new Set(raw ? raw.split(",") : []), [raw]);
}

export function markProjectViewed(id: string) {
  const ids = read() ? read().split(",") : [];
  if (!ids.includes(id)) write([...ids, id].join(","));
}

export function clearViewedProjects() {
  write("");
}
