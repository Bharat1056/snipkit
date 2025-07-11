import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_CONFIG, UPLOAD_CONFIG, PATH_CONFIG } from "../constants";
import s3Client from "../client";
import {
  FileUploadRequest,
  FileDeletionRequest,
  FileListRequest,
  FileUploadResponse,
  FileDeletionResponse,
  FileListResponse,
  S3File,
  S3ServiceError,
  FileUploadSchema,
  FileDeletionSchema,
  FileListSchema,
  GetSignedDownloadUrlRequest,
} from "../types";

const generateFileKey = (username: string, slug: string, filename: string): string => {
  const timestamp = Date.now();
  const sanitizedFilename = filename
                            .replace(/[^a-zA-Z0-9.-]/g, "_")  
                            .replace(/_{2,}/g, "_")           
                            .replace(/^(_+)|(_+)$/g, "")      
                            .substring(0, 255);       
  return `${PATH_CONFIG.userUploads}/${username}/${slug}-${timestamp}-${sanitizedFilename}`;
};

const validateFileSize = (fileSize: number): void => {
  if (fileSize > UPLOAD_CONFIG.maxFileSize) {
    throw new S3ServiceError(
      `File size ${fileSize} bytes exceeds maximum allowed size of ${UPLOAD_CONFIG.maxFileSize} bytes`,
      "FILE_SIZE_EXCEEDED"
    );
  }
};

const validateContentType = (contentType: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!UPLOAD_CONFIG.allowedContentTypes.includes(contentType as any)) {
    throw new S3ServiceError(
      `Content type '${contentType}' is not allowed`,
      "INVALID_CONTENT_TYPE"
    );
  }
};

export const uploadFile = async (
  request: FileUploadRequest
): Promise<FileUploadResponse> => {
  try {
    // Validate input
    const validatedRequest = FileUploadSchema.parse(request);
    
    // Validate file size and content type
    validateFileSize(validatedRequest.fileSize);
    validateContentType(validatedRequest.contentType);
    
    // Generate unique key
    const key = generateFileKey(
      validatedRequest.username,
      validatedRequest.slug,
      validatedRequest.filename
    );
    
    // Create presigned URL for that file
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.bucketName,
      Key: key,
      ContentType: validatedRequest.contentType,
      CacheControl: "no-cache",
      ContentDisposition: `attachment; filename="${validatedRequest.filename}"`,
    });

    // for production
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 5,
    });

    return {
      success: true,
      uploadUrl,
      key
    };
  } catch (error) {
    if (error instanceof S3ServiceError) {
      throw error;
    }
    throw new S3ServiceError(
      `Failed to generate upload URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      "UPLOAD_URL_GENERATION_FAILED",
      error
    );
  }
};

export const deleteFile = async (
  request: FileDeletionRequest
): Promise<FileDeletionResponse> => {
  try {
    // Validate input
    const validatedRequest = FileDeletionSchema.parse(request);
    
    const command = new DeleteObjectCommand({
      Bucket: AWS_CONFIG.bucketName,
      Key: validatedRequest.key,
    });
    
    await s3Client.send(command);
    
    return {
      success: true,
      message: `File '${validatedRequest.key}' deleted successfully`,
    };
  } catch (error) {
    throw new S3ServiceError(
      `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
      "FILE_DELETION_FAILED",
      error
    );
  }
};

export const listFiles = async (
  request: FileListRequest = {}
): Promise<FileListResponse> => {
  try {
    // Validate input
    const validatedRequest = FileListSchema.parse(request);
    
    const command = new ListObjectsV2Command({
      Bucket: AWS_CONFIG.bucketName,
      Prefix: validatedRequest.prefix,
      MaxKeys: validatedRequest.maxKeys,
      ContinuationToken: validatedRequest.continuationToken,
    });
    
    const response = await s3Client.send(command);
    
    const files: S3File[] = (response.Contents || []).map((object) => ({
      key: object.Key!,
      size: object.Size ?? 0,
      lastModified: object.LastModified!,
      etag: object.ETag?.replace(/"/g, "") ?? "",
      contentType: undefined, // ContentType is not available in ListObjectsV2 response
    }));
    
    return {
      success: true,
      files,
      continuationToken: response.NextContinuationToken,
      isTruncated: response.IsTruncated ?? false,
    };
  } catch (error) {
    throw new S3ServiceError(
      `Failed to list files: ${error instanceof Error ? error.message : "Unknown error"}`,
      "FILE_LISTING_FAILED",
      error
    );
  }
};

export const getSignedDownloadUrl = async (
  request: GetSignedDownloadUrlRequest
): Promise<string> => {

  const command = new GetObjectCommand({
    Bucket: AWS_CONFIG.bucketName,
    Key: request.key,
    ResponseContentDisposition: "inline",
  });

  const downloadUrl = await getSignedUrl(s3Client, command);

  return downloadUrl;
};