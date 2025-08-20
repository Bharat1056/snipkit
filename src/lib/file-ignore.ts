import { FilterResult } from '@/types/file-ignore.type';
import { minimatch } from 'minimatch';
import {
  CUSTOM_IGNORE_FILENAME,
  DEFAULT_IGNORE_PATTERNS,
} from '@/constants/file.constant';

/**
 * Parse ignore patterns from .snipkitignore file content
 */
function parseIgnorePatterns(content: string): string[] {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
    .map(pattern => {
      // Normalize patterns - ensure they work with minimatch
      if (pattern.endsWith('/')) {
        return `${pattern}**`;
      }
      return pattern;
    });
}

/**
 * Check if a file path matches any of the ignore patterns
 */
function isIgnored(
  filePath: string,
  patterns: string[]
): { ignored: boolean; matchedPattern?: string } {
  for (const pattern of patterns) {
    if (minimatch(filePath, pattern, { dot: true, matchBase: true })) {
      return { ignored: true, matchedPattern: pattern };
    }
  }
  return { ignored: false };
}

/**
 * Read and parse .snipkitignore file if present in the file list
 */
async function readCustomIgnorePatterns(files: File[]): Promise<string[]> {
  // Find the custom ignore file
  const ignoreFile = files.find(file => file.name === CUSTOM_IGNORE_FILENAME);

  if (!ignoreFile) {
    return [];
  }

  try {
    const content = await ignoreFile.text();
    return parseIgnorePatterns(content);
  } catch (error) {
    console.warn('Failed to read .snipkitignore file:', error);
    return [];
  }
}

/**
 * Filter files based on ignore patterns (both default and custom)
 */
export async function filterIgnoredFiles(files: File[]): Promise<FilterResult> {
  const customIgnorePatterns = await readCustomIgnorePatterns(files);

  const validFiles: File[] = [];
  const ignoredFiles: Array<{
    file: File;
    reason: string;
    pattern: string;
  }> = [];

  const patthernsToCheck = [];

  for (const file of files) {
    // Always exclude the .snipkitignore file itself
    if (file.name === CUSTOM_IGNORE_FILENAME) {
      ignoredFiles.push({
        file,
        reason: 'Configuration file (excluded automatically)',
        pattern: CUSTOM_IGNORE_FILENAME,
      });
      continue;
    }

    const filePath = (file as any).webkitRelativePath || file.name; // eslint-disable-line @typescript-eslint/no-explicit-any

    // check default ignore patterns first
    const defaultPatternMatch = isIgnored(filePath, DEFAULT_IGNORE_PATTERNS);

    // check custom ignore patterns
    const customPatternMatch =
      customIgnorePatterns.length > 0
        ? isIgnored(filePath, customIgnorePatterns)
        : { ignored: false };

    if (defaultPatternMatch.ignored) {
      ignoredFiles.push({
        file,
        reason: 'Matched default ignore pattern',
        pattern: defaultPatternMatch.matchedPattern!,
      });
      patthernsToCheck.push(defaultPatternMatch.matchedPattern!);
    } else if (customPatternMatch.ignored) {
      ignoredFiles.push({
        file,
        reason: 'Matched custom ignore pattern',
        pattern: customPatternMatch.matchedPattern!,
      });
      patthernsToCheck.push(customPatternMatch.matchedPattern!);
    } else {
      validFiles.push(file);
    }
  }

  return {
    validFiles,
    ignoredFiles,
    ignorePatterns: patthernsToCheck,
  };
}

/**
 * Get a human-readable summary of ignored files
 */
export function getIgnoreSummary(
  ignoredFiles: FilterResult['ignoredFiles']
): string {
  if (ignoredFiles.length === 0) return '';

  const groups = ignoredFiles.reduce(
    (acc, item) => {
      const key = item.reason;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item.file.name);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const summaries = Object.entries(groups).map(([reason, files]) => {
    const fileList =
      files.length <= 3
        ? files.join(', ')
        : `${files.slice(0, 3).join(', ')} and ${files.length - 3} more`;
    return `${fileList} (${reason.toLowerCase()})`;
  });

  return `Ignored ${ignoredFiles.length} file${ignoredFiles.length > 1 ? 's' : ''}: ${summaries.join('; ')}`;
}
