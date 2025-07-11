import {
  uploadFile,
  deleteFile,
  listFiles,
  getSignedDownloadUrl,
} from "./function";
import {
  FileUploadRequest,
  FileDeletionRequest,
  FileListRequest,
  FileUploadResponse,
  FileDeletionResponse,
  FileListResponse,
  S3ServiceError,
  GetSignedDownloadUrlRequest,
} from "./types";
import { validateS3Client } from "./client";

export class S3Service {
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      if (!validateS3Client()) {
        throw new Error("S3 client validation failed");
      }
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize S3 service:", error);
      throw new S3ServiceError(
        "S3 service initialization failed",
        "INITIALIZATION_FAILED",
        error
      );
    }
  }

  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    this.ensureInitialized();
    return uploadFile(request);
  }

  async deleteFile(request: FileDeletionRequest): Promise<FileDeletionResponse> {
    this.ensureInitialized();
    return deleteFile(request);
  }

  async listFiles(request: FileListRequest = {}): Promise<FileListResponse> {
    this.ensureInitialized();
    return listFiles(request);
  }

  async listUserFiles(
    username: string,
    maxKeys: number = 100
  ): Promise<FileListResponse> {
    this.ensureInitialized();
    const prefix = `uploads/user-uploads/${username}-`;
    return listFiles({ prefix, maxKeys });
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new S3ServiceError(
        "S3 service is not initialized",
        "SERVICE_NOT_INITIALIZED"
      );
    }
  }

  async getSignedDownloadUrl(request: GetSignedDownloadUrlRequest): Promise<string> {
    this.ensureInitialized();
    return getSignedDownloadUrl(request);
  }
}

export const s3Service = new S3Service();

export default S3Service; 