export interface FilterResult {
  validFiles: File[];
  ignoredFiles: Array<{
    file: File;
    reason: string;
    pattern: string;
  }>;
  ignorePatterns: string[];
}
