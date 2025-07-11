import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { AWS_CONFIG } from "./constants";

const s3ClientConfig: S3ClientConfig = {
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
  }
};

const s3Client = new S3Client(s3ClientConfig);

export const validateS3Client = (): boolean => {
  try {
    if (!AWS_CONFIG.accessKeyId || !AWS_CONFIG.secretAccessKey) {
      throw new Error("S3 credentials are not properly configured");
    }
    return true;
  } catch (error) {
    console.error("S3 client validation failed:", error);
    return false;
  }
};

export default s3Client;


export { s3ClientConfig };