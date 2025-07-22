import { minimatch } from 'minimatch';

const CUSTOM_IGNORE_FILENAME = '.snipkitignore';
const DEFAULT_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/git/**',
  '**/next/**',
  '**/turbo/**',
  '**/vercel/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/cache/**',
  '*.log',
  '*.DS_Store',
  '**/idea/**',
  '**/vscode/**',
  '**/__pycache__/**',
  '*.pyc',
  '**/venv/**',
  '**/venv/**',
  '**/env/**',
  '*.svg',
  '*.png',
  '*.jpg',
  '*.jpeg',
  '*.m4a',
  '*.mps',
  '**/pytest_cache/**',
  '**/terraform/**',
  '**/target/**',
  '**/vendor/**',
  '**/cargo/**',
  '**/gradle/**',
  '**/mvn/**',
  '*.class',
  '*.swp',
  '*.iml',
];

interface FilterResult {
  validFiles: File[];
  ignoredFiles: Array<{
    file: File;
    reason: string;
    pattern: string;
  }>;
  customIgnorePatterns: string[];
}

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
  const ignoreFile = files.find(
    file => file.name === CUSTOM_IGNORE_FILENAME
  );

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
  const allPatterns = [...DEFAULT_IGNORE_PATTERNS, ...customIgnorePatterns];

  const validFiles: File[] = [];
  const ignoredFiles: Array<{
    file: File;
    reason: string;
    pattern: string;
  }> = [];

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

    // Get the file path (use webkitRelativePath if available, otherwise just the name)
    const filePath = (file as any).webkitRelativePath || file.name; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Check against all patterns
    const defaultPatternMatch = isIgnored(filePath, DEFAULT_IGNORE_PATTERNS);
    const customPatternMatch = customIgnorePatterns.length > 0 
      ? isIgnored(filePath, customIgnorePatterns) 
      : { ignored: false };

    if (defaultPatternMatch.ignored) {
      ignoredFiles.push({
        file,
        reason: 'Matched default ignore pattern',
        pattern: defaultPatternMatch.matchedPattern!,
      });
    } else if (customPatternMatch.ignored) {
      ignoredFiles.push({
        file,
        reason: 'Matched custom ignore pattern',
        pattern: customPatternMatch.matchedPattern!,
      });
    } else {
      validFiles.push(file);
    }
  }

  return {
    validFiles,
    ignoredFiles,
    customIgnorePatterns,
  };
}

/**
 * Get a human-readable summary of ignored files
 */
export function getIgnoreSummary(ignoredFiles: FilterResult['ignoredFiles']): string {
  if (ignoredFiles.length === 0) return '';

  const groups = ignoredFiles.reduce((acc, item) => {
    const key = item.reason;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item.file.name);
    return acc;
  }, {} as Record<string, string[]>);

  const summaries = Object.entries(groups).map(([reason, files]) => {
    const fileList = files.length <= 3 
      ? files.join(', ') 
      : `${files.slice(0, 3).join(', ')} and ${files.length - 3} more`;
    return `${fileList} (${reason.toLowerCase()})`;
  });

  return `Ignored ${ignoredFiles.length} file${ignoredFiles.length > 1 ? 's' : ''}: ${summaries.join('; ')}`;
}

/**
 * Export constants for external use
 */
export { DEFAULT_IGNORE_PATTERNS, CUSTOM_IGNORE_FILENAME }; 