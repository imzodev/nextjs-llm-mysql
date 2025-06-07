import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts a JS Date or ISO string to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
export function toMySQLDatetime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 19).replace("T", " ");
}
