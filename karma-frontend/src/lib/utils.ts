import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTime(date: string) {
  const convertedDate = new Date(Date.parse(date));
  const hours: number = convertedDate.getUTCHours();
  const minutes: number = convertedDate.getUTCMinutes();
  const stringMinutes = `${minutes}`.padStart(2, "0");
  const stringHours = `${hours}`.padStart(2, "0");
  return `${stringHours}:${stringMinutes}`;
}

export function parseDate(date: string) {
  const convertedDate = new Date(date);
  return convertedDate.toISOString().split("T")[0];
}
