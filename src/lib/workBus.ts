"use client";

import { useSyncExternalStore } from "react";

/**
 * How the rest of the page talks to the Work section: the hero diagram and the Stack chips ask it to
 * show the projects that use a technology, the command palette asks it to open a case.
 */
export type TechFilter = { label: string; techs: string[] };

const listeners = new Set<() => void>();
let tech: TechFilter | null = null;

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}
const snapshot = () => tech;
const serverSnapshot = () => null;

export function useTechFilter(): TechFilter | null {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

export function setTechFilter(next: TechFilter | null) {
  tech = next;
  listeners.forEach((notify) => notify());
}

const OPEN_PROJECT = "portfolio:open-project";

export function requestOpenProject(id: string) {
  window.dispatchEvent(new CustomEvent<string>(OPEN_PROJECT, { detail: id }));
}

export function onOpenProjectRequest(handler: (id: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(OPEN_PROJECT, listener);
  return () => window.removeEventListener(OPEN_PROJECT, listener);
}
