import { z } from "zod";

export const FileUploadSchema = z.object({
  username: z.string().min(1, "Username is required"),
  filename: z.string().min(1, "Filename is required"),
  slug: z.string().min(1, "Slug is required"),
  contentType: z.string().min(1, "Content type is required"),
  fileSize: z.number().positive("File size must be positive"),
  metadata: z.record(z.string()).optional(),
});

export const FileDeletionSchema = z.object({
  key: z.string().min(1, "File key is required"),
});

export const FileListSchema = z.object({
  prefix: z.string().optional(),
  maxKeys: z.number().min(1).max(1000).default(100),
  continuationToken: z.string().optional(),
});

// TypeScript interfaces
export interface FileUploadRequest {
  username: string;
  filename: string;
  slug: string;
  contentType: string;
  fileSize: number;
  metadata?: Record<string, string>;
}

export interface GetSignedDownloadUrlRequest {
  key: string;
}

export interface FileDeletionRequest {
  key: string;
}

export interface FileListRequest {
  prefix?: string;
  maxKeys?: number;
  continuationToken?: string;
}

// Response interfaces
export interface FileUploadResponse {
  success: boolean;
  uploadUrl: string;
  key: string;
  expiresAt?: Date;
}

export interface FileDeletionResponse {
  success: boolean;
  message: string;
}

export interface FileListResponse {
  success: boolean;
  files: S3File[];
  continuationToken?: string;
  isTruncated: boolean;
}

export interface S3File {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
  contentType?: string;
}

export interface S3Error {
  code: string;
  message: string;
  details?: unknown;
}

// Error types
export class S3ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "S3ServiceError";
  }
}