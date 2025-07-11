// Main S3 service exports
export { s3Service, S3Service } from "./service";
export { validateS3Client } from "./client";

// Type exports
export type {
  FileUploadRequest,
  FileDeletionRequest,
  FileListRequest,
  FileUploadResponse,
  FileDeletionResponse,
  FileListResponse,
  S3File,
  S3Error,
} from "./types";

// Error exports
export { S3ServiceError } from "./types";

// Schema exports for validation
export {
  FileUploadSchema,
  FileDeletionSchema,
  FileListSchema,
} from "./types";

// Configuration exports
export {
  AWS_CONFIG,
  UPLOAD_CONFIG,
  PATH_CONFIG,
  accessKeyId,
  secretAccessKey,
  bucketName,
} from "./constants";

// Function exports (for advanced usage)
export {
  uploadFile,
  deleteFile,
  listFiles,
} from "./function";

