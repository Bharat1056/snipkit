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
  Files,
  CloudUpload,
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
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <CloudUpload className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">Upload Code</CardTitle>
            <CardDescription className="text-gray-400">
              Upload files or folders with syntax highlighting support for common languages
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* File Selection */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Select Code File(s) or Folder</Label>
          <div className="flex items-center gap-2">
            <Input 
              ref={fileInputRef} 
              type="file" 
              onChange={handleFileSelect} 
              disabled={isUploading} 
              className="hidden" 
              multiple 
            />
            <Input 
              ref={folderInputRef}
              type="file" 
              onChange={handleFileSelect} 
              disabled={isUploading} 
              className="hidden" 
              multiple 
              webkitdirectory="true"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  disabled={isUploading} 
                  className="w-full justify-start text-left font-normal border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files or Folder
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-gray-600 bg-gray-800/90 backdrop-blur-sm">
                <DropdownMenuItem 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select File(s)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => folderInputRef.current?.click()}
                  className="text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  <FolderUp className="mr-2 h-4 w-4" />
                  Select Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Files className="h-4 w-4 text-blue-400" />
                <Label className="text-white font-medium">
                  Selected Files ({selectedFiles.length})
                </Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFiles} 
                disabled={isUploading}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                Clear All
              </Button>
            </div>
            
            <div className="rounded-lg border border-gray-600/30 bg-gray-900/50 backdrop-blur-sm p-3 max-h-60 overflow-y-auto overflow-x-hidden">
  <ul className="space-y-2">
    {selectedFiles.map((file, index) => {
      const pathKey = (file as any).webkitRelativePath || file.name; // eslint-disable-line @typescript-eslint/no-explicit-any
      const percent = uploadProgressMap[pathKey] || 0;

      return (
        <li
          key={index}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-2 rounded bg-gray-800/50 w-full"
        >
          <FileCode className="h-4 w-4 text-green-400 flex-shrink-0" />

          {/* Filename + size */}
          <div className="min-w-0">
            <p
              className="text-sm text-white truncate"
              title={pathKey}
            >
              {pathKey}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>

          {/* Remove / progress */}
          <div className="flex-shrink-0">
            {isUploading ? (
              <CircularProgress value={percent} />
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(file)}
                disabled={isUploading}
                className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </li>
      );
    })}
  </ul>
</div>

          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white font-medium">Title *</Label>
            <Input 
              value={formData.title} 
              onChange={(e) => handleTitleChange(e.target.value)} 
              placeholder="Enter a title for your code" 
              disabled={isUploading}
              className="border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white font-medium">Slug *</Label>
            <Input 
              value={formData.slug} 
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} 
              placeholder="my-awesome-function" 
              disabled={isUploading}
              className="border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white font-medium">Description</Label>
          <Textarea 
            value={formData.description} 
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} 
            placeholder="Optional description of your code" 
            disabled={isUploading}
            className="border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-500 resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white font-medium">Access</Label>
          <Select 
            value={formData.access} 
            onValueChange={(value: "public" | "private") => setFormData((prev) => ({ ...prev, access: value }))} 
            disabled={isUploading}
          >
            <SelectTrigger className="border-gray-600 bg-gray-700/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-600 bg-gray-800/90 backdrop-blur-sm">
              <SelectItem value="public" className="text-gray-300 hover:bg-gray-700/50 hover:text-white">
                Public
              </SelectItem>
              <SelectItem value="private" className="text-gray-300 hover:bg-gray-700/50 hover:text-white">
                Private
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Button */}
        <Button 
          onClick={handleUpload} 
          disabled={selectedFiles.length === 0 || !formData.title || !formData.slug || isUploading} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          size="lg"
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
