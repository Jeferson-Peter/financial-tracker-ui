import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractQuery = (fullUrl: string | null) => {
  if (!fullUrl) return null;
  const url = new URL(fullUrl);
  return `/api/account-types${url.search}`;
};