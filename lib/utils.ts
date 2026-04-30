import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizePlate(plate: string) {
  return plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function minutesRemaining(finish: string | Date) {
  const diff = new Date(finish).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 60000));
}

export function maskPlate(plate: string, mode: string) {
  if (mode === "job") return "";
  if (mode === "full") return plate;
  const clean = plate.trim();
  if (clean.length <= 4) return clean;
  return `${clean.slice(0, 3)}-***${clean.slice(-1)}`;
}
