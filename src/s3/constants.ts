// Environment variables with validation
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// AWS S3 Configuration
export const AWS_CONFIG = {
  accessKeyId: getRequiredEnvVar("AWS_S3_ACCESS_KEY_ID"),
  secretAccessKey: getRequiredEnvVar("AWS_S3_SECRET_ACCESS_KEY"),
  region: getRequiredEnvVar("AWS_S3_REGION"),
  bucketName: getRequiredEnvVar("BUCKET_NAME"),
} as const;

// S3 Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedContentTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "video/webm",
    "video/vnd.dlna.mpeg-tts",
    "audio/mpeg",
    "audio/wav",
    // Code file types
    "text/javascript",
    "text/typescript",
    "text/x-python",
    "text/x-go",
    "text/x-rust",
    "application/javascript",
    "application/typescript",
  ] as const,
  presignedUrlExpiration: 3600, // 1 hour
  downloadUrlExpiration: 3600, // 1 hour
} as const;

// S3 Path Configuration
export const PATH_CONFIG = {
  uploads: "uploads",
  userUploads: "uploads/user-uploads",
  temp: "uploads/temp",
  public: "uploads/public",
} as const;

// Legacy exports for backward compatibility
export const accessKeyId = AWS_CONFIG.accessKeyId;
export const secretAccessKey = AWS_CONFIG.secretAccessKey;
export const bucketName = AWS_CONFIG.bucketName;