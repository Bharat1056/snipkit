"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, FileCode, X, Code, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface CodeUploadProps {
  readonly onUploadComplete?: () => void;
}

// Allowed extensions for upload
const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.json', '.txt', '.java', '.py', '.cpp'
];

function getMimeType(file: File): string {
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'text/typescript';
    case '.js':
    case '.jsx':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    case '.txt':
      return 'text/plain';
    case '.java':
      return 'text/x-java-source';
    case '.py':
      return 'text/x-python';
    case '.cpp':
      return 'text/x-c++src';
    default:
      return file.type || 'application/octet-stream';
  }
}

const LANGUAGE_MAP = {
  '.js': 'JAVASCRIPT',
  '.jsx': 'JAVASCRIPT',
  '.ts': 'TYPESCRIPT',
  '.tsx': 'TYPESCRIPT',
  '.json': 'JSON',
  '.txt': 'TEXT',
  '.java': 'JAVA',
  '.py': 'PYTHON',
  '.cpp': 'C++',
};

export function CodeUpload({ onUploadComplete }: CodeUploadProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    access: "public" as "public" | "private",
    exploitLocation: "",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [formattedContent, setFormattedContent] = useState<string>("");

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Please sign in to upload code files.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get file extension
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    // Check if extension is allowed
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError(`File type not supported. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`);
      if (event.target) event.target.value = '';
      return;
    }

    // Validate file size (10MB limit for code files)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Read file content
    try {
      const content = await file.text();
      setFileContent(content);
      setFormattedContent(content);
    } catch (error) {
      console.error("Error reading file content:", error);
      setError("Failed to read file content");
      return;
    }
    
    // Auto-generate slug from title if not set
    if (!formData.slug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title,
      slug: generateSlug(title)
    }));
  };

  const formatCode = async () => {
    if (!fileContent) return;
    
    setIsFormatting(true);
    try {
      const response = await fetch("/api/code/format", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: fileContent,
          language: selectedFile ? LANGUAGE_MAP[selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase() as keyof typeof LANGUAGE_MAP] : 'JAVASCRIPT'
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to format code");
      }

      const { formattedCode } = await response.json();
      setFormattedContent(formattedCode);
    } catch (error) {
      console.error("Error formatting code:", error);
      setError("Failed to format code");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title || !formData.slug || !formData.exploitLocation) {
      setError("Please fill in all required fields and select a file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);
    
    try {
      // Step 1: Get upload URL from API
      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          slug: formData.slug,
          filename: selectedFile.name,
          contentType: getMimeType(selectedFile),
          fileSize: selectedFile.size,
          access: formData.access,
          exploitLocation: formData.exploitLocation,
          language: LANGUAGE_MAP[selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase() as keyof typeof LANGUAGE_MAP] || 'TEXT',
          codeContent: formattedContent || fileContent,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to get upload URL";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error ?? errorMessage;
        } catch (jsonError) { 
          console.error("Failed to parse error response:", jsonError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const { uploadUrl } = await response.json();
        
      // Step 2: Upload file to S3 using axios for progress tracking
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const config = {
        headers: {
          "Content-Type": getMimeType(selectedFile),
          "Cache-Control": "no-cache",
          "Content-Disposition": `attachment; filename=\"${selectedFile.name}\"`,
        },
        onUploadProgress: (progressEvent: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
        cancelToken: source.token,
      };

      try {
        await axios.put(uploadUrl, selectedFile, config);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", (err as any).message); // eslint-disable-line @typescript-eslint/no-explicit-any
          throw new Error("Upload was canceled");
        } else {
          console.error('S3 upload failed:', (err as any).response?.status, (err as any).response?.data); // eslint-disable-line @typescript-eslint/no-explicit-any
          throw new Error(`S3 upload failed: ${(err as any).response?.status} - ${(err as any).message}`); // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      }

      await fetch("/api/code/upload", {
        method: "POST",
        body: JSON.stringify({
          slug: formData.slug,
          filename: selectedFile.name,
        }),
      });

      setSuccess("Code file uploaded successfully!");
      setUploadProgress(100);
      
      setFormData({
        title: "",
        description: "",
        slug: "",
        access: "public",
        exploitLocation: "",
      });

      setSelectedFile(null);
      setFileContent("");
      setFormattedContent("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Call callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      // Refresh the page to show new code
      router.refresh();
      
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileContent("");
    setFormattedContent("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-xl m-0 mt-3 mb-3 shadow-none border-none">
      <CardHeader className="pb-1 px-6 pt-3">
        <CardTitle className="text-lg">Upload Code File</CardTitle>
        <CardDescription>
          Upload code files with syntax highlighting and formatting. Supports JavaScript, TypeScript, JSON, TXT, Java, Python, and C++.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
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

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file">Select Code File</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              accept={ALLOWED_EXTENSIONS.join(",")}
              onChange={handleFileSelect}
              disabled={isUploading}
              className="w-full"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
            <FileCode className="h-5 w-5 text-green-500" />
            <span className="flex-1 text-sm break-all">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(selectedFile.size / 1024).toFixed(2)} KB)
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Code Preview and Format */}
        {fileContent && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Code Preview</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={formatCode}
                disabled={isFormatting}
              >
                {isFormatting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Format Code
              </Button>
            </div>
            <div className="border rounded-lg p-3 bg-background max-h-48 overflow-y-auto scrollbar-hidden">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                <code>{formattedContent || fileContent}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter a title for your code"
              disabled={isUploading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="my-awesome-function"
              disabled={isUploading}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used in the URL to access your code.
            </p>
          </div>

          <div>
            <Label htmlFor="exploitLocation">Exploit Location *</Label>
            <Input
              id="exploitLocation"
              value={formData.exploitLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, exploitLocation: e.target.value }))}
              placeholder="e.g., /api/users, /admin/panel"
              disabled={isUploading}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Where this code exploit is applicable
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description of your code"
              disabled={isUploading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="access">Access</Label>
            <Select
              value={formData.access}
              onValueChange={(value: "public" | "private") =>
                setFormData(prev => ({ ...prev, access: value }))
              }
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
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

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !formData.title || !formData.slug || !formData.exploitLocation || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Code className="mr-2 h-4 w-4" />
              Upload Code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 