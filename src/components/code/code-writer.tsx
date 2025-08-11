'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/auth.hook';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const languages = [
  {
    name: 'JavaScript',
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    highlighter: 'javascript',
  },
  {
    name: 'TypeScript',
    extensions: ['.ts', '.tsx'],
    highlighter: 'typescript',
  },
  { name: 'Java', extensions: ['.java'], highlighter: 'java' },
  { name: 'Go', extensions: ['.go'], highlighter: 'go' },
  { name: 'Python', extensions: ['.py'], highlighter: 'python' },
  { name: 'Rust', extensions: ['.rs'], highlighter: 'rust' },
  { name: 'HTML', extensions: ['.html', '.htm'], highlighter: 'html' },
  { name: 'CSS', extensions: ['.css'], highlighter: 'css' },
];

const LANGUAGE_MAP: { [key: string]: string } = {
  '.js': 'JAVASCRIPT',
  '.jsx': 'JAVASCRIPT',
  '.mjs': 'JAVASCRIPT',
  '.cjs': 'JAVASCRIPT',
  '.ts': 'TYPESCRIPT',
  '.tsx': 'TYPESCRIPT',
  '.java': 'JAVA',
  '.go': 'GO',
  '.py': 'PYTHON',
  '.rs': 'RUST',
  '.html': 'HTML',
  '.htm': 'HTML',
  '.css': 'CSS',
};

function getMimeType(extension: string): string {
  const ext = extension.toLowerCase();
  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'text/typescript';
    case '.js':
    case '.jsx':
    case '.mjs':
    case '.cjs':
      return 'text/javascript';
    case '.java':
      return 'text/x-java-source';
    case '.go':
      return 'text/x-go';
    case '.py':
      return 'text/x-python';
    case '.rs':
      return 'text/x-rustsrc';
    case '.html':
    case '.htm':
      return 'text/html';
    case '.css':
      return 'text/css';
    default:
      return 'text/plain';
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CodeWriter({
  onWriteComplete,
}: {
  onWriteComplete?: () => void;
}) {
  const { auth, isValidAuth } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [exploitLocation, setExploitLocation] = useState('');
  const [language, setLanguage] = useState(languages[0].name);
  const [availableExtensions, setAvailableExtensions] = useState(
    languages[0].extensions
  );
  const [extension, setExtension] = useState(languages[0].extensions[0]);
  const [code, setCode] = useState('');
  const [access, setAccess] = useState('private');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  useEffect(() => {
    const selectedLanguage = languages.find(lang => lang.name === language);
    if (selectedLanguage) {
      setAvailableExtensions(selectedLanguage.extensions);
      setExtension(selectedLanguage.extensions[0]);
    }
  }, [language]);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const validateSyntax = () => {
    const lang = LANGUAGE_MAP[extension.toLowerCase()] || 'TEXT';
    if (lang === 'JAVASCRIPT') {
      try {
        new Function(code);
        return { valid: true, message: null };
      } catch (e) {
        if (e instanceof SyntaxError) {
          return { valid: false, message: e.message };
        }
        return { valid: true, message: null };
      }
    }
    // For other languages, no client-side validation
    return { valid: true, message: null };
  };

  const formatCode = async () => {
    if (!code) return;

    const validation = validateSyntax();
    if (!validation.valid) {
      setError(`Syntax error: ${validation.message}`);
      return;
    }

    setIsFormatting(true);
    setError(null);

    try {
      const ext = extension.toLowerCase();
      const lang = LANGUAGE_MAP[ext] || 'TEXT';

      const response = await fetch('/api/code/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: lang,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to format code');
      }

      const { formattedCode } = await response.json();
      setCode(formattedCode);
    } catch (err) {
      console.error('Error formatting code:', err);
      setError('Failed to format code');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !slug || !code) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const ext = extension.toLowerCase();
      const mime = getMimeType(ext);
      const filename = (slug || 'index') + extension;
      const file = new File([code], filename, { type: mime });

      // Step 1: Get upload URL
      const response = await fetch('/api/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          slug,
          access,
          downloadPath: exploitLocation,
          files: [
            {
              name: filename,
              path: filename,
              contentType: mime,
              size: file.size,
            },
          ],
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get upload URL';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error ?? errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const { filesWithUrls } = await response.json();

      if (!filesWithUrls || filesWithUrls.length === 0) {
        throw new Error('Did not receive an upload URL from the server.');
      }

      const { uploadUrl } = filesWithUrls[0];

      // Step 2: Upload to S3
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'no-cache',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
        onUploadProgress: (progressEvent: any) => {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setSuccess('Code uploaded successfully!');
      setUploadProgress(100);

      // Reset form
      setTitle('');
      setSlug('');
      setDescription('');
      setExploitLocation('');
      setCode('');
      setSlugManuallyEdited(false);

      if (onWriteComplete) onWriteComplete();
      router.refresh();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isValidAuth) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>Please sign in to upload code.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 w-full">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Language & Extension */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select onValueChange={handleLanguageChange} defaultValue={language}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.name} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="extension">Extension</Label>
          <Select onValueChange={setExtension} value={extension}>
            <SelectTrigger>
              <SelectValue placeholder="Select an extension" />
            </SelectTrigger>
            <SelectContent>
              {availableExtensions.map(ext => (
                <SelectItem key={ext} value={ext}>
                  {ext}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="code">Code</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={formatCode}
            disabled={isFormatting || isUploading}
          >
            {isFormatting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Format Code
          </Button>
        </div>
        <Textarea
          id="code"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="// Write your code here..."
          className="h-[400px] font-mono text-base bg-[#1e1e1e] text-[#d4d4d4] border border-[#2d2d2d] rounded-md px-4 py-3 leading-relaxed focus:outline-none focus:border-[#007acc] shadow-[0_2px_8px_#00000020] transition-all resize-none overflow-y-auto scrollbar-hidden"
          disabled={isUploading}
        />
      </div>

      {/* Title and Slug */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            if (!slugManuallyEdited) setSlug(slugify(e.target.value));
          }}
          placeholder="My awesome snippet"
          disabled={isUploading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={slug}
          onChange={e => {
            setSlug(e.target.value);
            setSlugManuallyEdited(true);
          }}
          placeholder="my-awesome-snippet"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Used in the URL. You can edit it.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="A short description of your snippet"
          disabled={isUploading}
        />
      </div>

      {/* Exploit Location */}
      <div className="space-y-2">
        <Label htmlFor="exploitLocation">Exploit Location</Label>
        <Input
          id="exploitLocation"
          value={exploitLocation}
          onChange={e => setExploitLocation(e.target.value)}
          placeholder="e.g., /api/users, /admin/panel"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Where this code exploit is applicable
        </p>
      </div>

      {/* Access */}
      <div className="space-y-2">
        <Label>Access</Label>
        <div className="flex gap-2">
          <Button
            variant={access === 'private' ? 'default' : 'outline'}
            onClick={() => setAccess('private')}
            disabled={isUploading}
          >
            Private
          </Button>
          <Button
            variant={access === 'public' ? 'default' : 'outline'}
            onClick={() => setAccess('public')}
            disabled={isUploading}
          >
            Public
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!title || !slug || !code || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </div>
  );
}
