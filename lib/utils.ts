import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const checksinglenumber = (view: number) => {
  //if <10 view else views
  return view < 10 ? "View" : "Views"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
