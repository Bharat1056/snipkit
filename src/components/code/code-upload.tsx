"use client";

import { useRef } from "react";
import { useCodeUploadForm } from "@/hooks/useCodeUploadForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  FileCode,
  X,
  Code,
  FolderUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircularProgress } from "@/components/circular-progress";

interface CodeUploadProps {
  readonly onUploadComplete?: () => void;
}

export function CodeUpload({ onUploadComplete }: CodeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useCodeUploadForm({ onUploadComplete });

  return (
    <Card className="w-full max-w-xl m-0 mt-3 mb-3 shadow-none border-none">
      <CardHeader className="pb-1 px-6 pt-3">
        <CardTitle className="text-lg">Upload Code File</CardTitle>
        <CardDescription>
          Upload any file or folder. Syntax highlighting is supported for common languages.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}

        <div className="space-y-2">
          <Label>Select Code File(s) or Folder</Label>
          <div className="flex items-center gap-2">
            <Input ref={fileInputRef} type="file" onChange={handleFileSelect} disabled={isUploading} className="hidden" multiple />
            <Input ref={folderInputRef} type="file" onChange={handleFileSelect} disabled={isUploading} className="hidden" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isUploading} className="w-full justify-start text-left font-normal">
                  <Upload className="h-4 w-4 mr-2" />Select Files or Folder
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />Select File(s)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => folderInputRef.current?.click()}>
                  <FolderUp className="mr-2 h-4 w-4" />Select Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <Button variant="ghost" size="sm" onClick={clearFiles} disabled={isUploading}>Clear all</Button>
            </div>
            <div className="flex flex-col gap-2 p-3 border rounded-lg bg-muted max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => {
                const pathKey = (file as any).webkitRelativePath || file.name;
                const percent = uploadProgressMap[pathKey] || 0;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="flex-1 text-sm break-all">{pathKey}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                    {isUploading ? (
                      <CircularProgress value={percent} />
                    ) : (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(file)} disabled={isUploading} className="h-6 w-6">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label>Title *</Label>
          <Input value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter a title for your code" disabled={isUploading} />
          <Label>Slug *</Label>
          <Input value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} placeholder="my-awesome-function" disabled={isUploading} />
          <Label>Download Path</Label>
          <Textarea value={formData.downloadPath} onChange={(e) => setFormData((prev) => ({ ...prev, downloadPath: e.target.value }))} placeholder="Optional download path" disabled={isUploading} />
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} placeholder="Optional description" disabled={isUploading} />
          <Label>Access</Label>
          <Select value={formData.access} onValueChange={(value: "public" | "private") => setFormData((prev) => ({ ...prev, access: value }))} disabled={isUploading}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || !formData.title || !formData.slug || isUploading} className="w-full">
          {isUploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>) : (<><Code className="mr-2 h-4 w-4" />Upload Code</>)}
        </Button>
      </CardContent>
    </Card>
  );
}
