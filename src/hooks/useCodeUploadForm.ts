import { useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { generateSlug } from '@/lib/utils';
import { getContentType } from '@/lib/utils';
import { toast } from 'sonner';
import { filterIgnoredFiles, getIgnoreSummary } from '@/lib/file-ignore';

interface UseCodeUploadFormProps {
  onUploadComplete?: () => void;
}

interface FormData {
  title: string;
  description: string;
  slug: string;
  access: 'public' | 'private';
  downloadPath: string;
}

export function useCodeUploadForm({
  onUploadComplete,
}: UseCodeUploadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    slug: '',
    access: 'public',
    downloadPath: '',
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState<
    Record<string, number>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    try {
      // Filter files based on ignore patterns
      const filterResult = await filterIgnoredFiles(newFiles);
      const { validFiles, ignoredFiles, customIgnorePatterns } = filterResult;

      // Show toast messages for ignored files
      if (ignoredFiles.length > 0) {
        const summary = getIgnoreSummary(ignoredFiles);

        toast.warning('Some Files Ignored', {
          description: summary,
          duration: 5000,
        });

        // Log detailed information for debugging
        if (customIgnorePatterns.length > 0) {
          console.log(
            'Custom ignore patterns from .snipkitignore:',
            customIgnorePatterns
          );
        }
      }

      // Add valid files to selection
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        setError(null);

        toast.success(
          `${validFiles.length} file${validFiles.length > 1 ? 's' : ''} selected`,
          {
            description:
              ignoredFiles.length > 0
                ? `${ignoredFiles.length} file${ignoredFiles.length > 1 ? 's' : ''} ignored based on patterns`
                : undefined,
          }
        );
      } else if (ignoredFiles.length > 0) {
        // All files were ignored
        toast.error('No Files Selected', {
          description:
            'All selected files were ignored based on ignore patterns',
        });
      }
    } catch (error) {
      console.error('Error filtering files:', error);
      toast.error('File Processing Error', {
        description: 'Failed to process selected files. Please try again.',
      });
    }

    // Clear the input
    event.target.value = '';
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles(prev => prev.filter(f => f !== fileToRemove));
  };

  const clearFiles = () => setSelectedFiles([]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !formData.title || !formData.slug) {
      setError(
        'Please fill in all required fields and select at least one file'
      );
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgressMap({});

    try {
      const filesToUpload = selectedFiles.map(file => ({
        name: file.name.split(' ').join('-'), // sanitize file name
        path: (file as any).webkitRelativePath || file.name, // eslint-disable-line @typescript-eslint/no-explicit-any
        contentType: getContentType(file.name),
        size: file.size,
      }));

      const response = await axios.post('/api/code', {
        ...formData,
        files: filesToUpload,
      });

      const { filesWithUrls } = response.data;

      const uploadPromises = filesWithUrls.map(
        async ({ path, uploadUrl }: { path: string; uploadUrl: string }) => {
          const file = selectedFiles.find(
            f => ((f as any).webkitRelativePath || f.name) === path // eslint-disable-line @typescript-eslint/no-explicit-any
          );
          if (!file) return;

          await axios.put(uploadUrl, file, {
            headers: {
              'Content-Type': getContentType(file.name),
              'Cache-Control': 'no-cache',
              'Content-Disposition': `attachment; filename="${file.name}"`,
            },
            onUploadProgress: (e: AxiosProgressEvent) => {
              const percent = Math.round((e.loaded * 100) / (e.total || 1));
              setUploadProgressMap(prev => ({ ...prev, [path]: percent }));
            },
          });
        }
      );

      await Promise.all(uploadPromises);

      setSuccess(`Project "${formData.title}" created successfully!`);
      setFormData({
        title: '',
        description: '',
        slug: '',
        access: 'public',
        downloadPath: '',
      });
      setSelectedFiles([]);

      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      let errorMessage = 'Failed to upload files. Please try again.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    formData,
    selectedFiles,
    isUploading,
    uploadProgressMap,
    error,
    success,
    handleTitleChange,
    handleUpload,
    handleFileSelect,
    removeFile,
    clearFiles,
    setFormData,
  };
}
