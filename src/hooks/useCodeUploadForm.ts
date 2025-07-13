import { useState } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { generateSlug } from "@/lib/utils";

interface UseCodeUploadFormProps {
  onUploadComplete?: () => void;
}

interface FormData {
  title: string;
  description: string;
  slug: string;
  access: "public" | "private";
  downloadPath: string;
}

export function useCodeUploadForm({ onUploadComplete }: UseCodeUploadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    slug: "",
    access: "public",
    downloadPath: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setError(null);
    event.target.value = "";
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== fileToRemove));
  };

  const clearFiles = () => setSelectedFiles([]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !formData.title || !formData.slug) {
      setError("Please fill in all required fields and select at least one file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgressMap({});

    try {
      const filesToUpload = selectedFiles.map((file) => ({
        name: file.name,
        path: (file as any).webkitRelativePath || file.name,
        contentType: file.type,
        size: file.size,
      }));

      const response = await axios.post("/api/code", { ...formData, files: filesToUpload });

      const { filesWithUrls } = response.data;

      const uploadPromises = filesWithUrls.map(
        async ({ path, uploadUrl }: { path: string; uploadUrl: string }) => {
          const file = selectedFiles.find(
            (f) => ((f as any).webkitRelativePath || f.name) === path
          );
          if (!file) return;

          await axios.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
              "Cache-Control": "no-cache",
              "Content-Disposition": `attachment; filename=\"${file.name}\"`,
            },
            onUploadProgress: (e: AxiosProgressEvent) => {
              const percent = Math.round((e.loaded * 100) / (e.total || 1));
              setUploadProgressMap((prev) => ({ ...prev, [path]: percent }));
            },
          });
        }
      );

      await Promise.all(uploadPromises);

      try {
        await axios.post("/api/code/signed-url", {
          slug: formData.slug,
        });
      } catch (e) {
        console.warn("Failed to fetch signed URLs:", e);
      }

      setSuccess(`Project "${formData.title}" created successfully!`);
      setFormData({ title: "", description: "", slug: "", access: "public", downloadPath: "" });
      setSelectedFiles([]);

      if (onUploadComplete) onUploadComplete();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.response?.data?.error || err.message || "Upload failed");
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
