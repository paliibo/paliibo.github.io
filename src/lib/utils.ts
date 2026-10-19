import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

/** 6 → "Six"; numbers past twelve stay as digits. */
export function numberWord(n: number): string {
  return words[n] ?? String(n);
}
