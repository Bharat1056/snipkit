import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { lookup } from "mime-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  }
  return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export function getContentType(fileName: string): string {
  const mime = lookup(fileName);
  if (mime) return mime;

  if (fileName.endsWith(".tsx")) return "application/typescript";
  if (fileName.endsWith(".ts")) return "application/typescript";
  if (fileName.endsWith(".jsx")) return "application/javascript";
  if (fileName.endsWith(".mdx")) return "text/markdown";

  return "application/octet-stream"; // fallback
}
