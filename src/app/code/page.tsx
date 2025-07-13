"use client";
import { useState, useRef } from "react";
import { CodeUpload } from "@/components/code/code-upload";
import { CodeWriter } from "@/components/code/code-writer";
import { MyCodeGallery } from "@/components/code/my-code-gallery";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

interface CodeGalleryRef {
  refetch: () => void;
}

export default function CodePage() {
  const [open, setOpen] = useState(false);
  const [isWriteModalOpen, setWriteModalOpen] = useState(false);
  const galleryRef = useRef<CodeGalleryRef>(null);

  const handleUploadComplete = () => {
    setOpen(false);
    if (galleryRef.current) {
      galleryRef.current.refetch();
    }
  };

  const handleWriteComplete = () => {
    setWriteModalOpen(false);
    if (galleryRef.current) {
      galleryRef.current.refetch();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Code Snippets</h1>
          <p className="text-muted-foreground">
            Upload, view, and manage your code files. Supports JavaScript, TypeScript, Python, Go, and Rust with syntax highlighting.
          </p>
        </div>

        {/* Upload and Write buttons */}
        <div className="mb-12 flex space-x-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="lg" className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Code
            </Button>
          </DialogTrigger>
          <DialogContent
            className="p-0 w-full max-w-[95vw] md:max-w-xl max-h-[90vh] rounded-2xl shadow-xl bg-background overflow-y-auto scrollbar-none"
            style={{ border: "none", WebkitOverflowScrolling: "touch" }}
          >
            <div className="w-full flex flex-col items-center justify-center p-6">
              <CodeUpload onUploadComplete={handleUploadComplete} />
            </div>
          </DialogContent>
        </Dialog>
          <Dialog open={isWriteModalOpen} onOpenChange={setWriteModalOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Write Code
              </Button>
            </DialogTrigger>
            <DialogContent
              className="flex flex-col items-center justify-center p-0 bg-background w-full max-w-[96vw] md:max-w-xl max-h-[95vh] rounded-2xl shadow-2xl overflow-y-auto scrollbar-hidden"
              style={{ border: "none" }}
            >
              <div className="w-full flex flex-col items-center justify-center p-0">
                <DialogTitle className="w-full px-6 pt-6 pb-0 text-left text-xl font-semibold">
                  Write Code
                </DialogTitle>
                <CodeWriter onWriteComplete={handleWriteComplete} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Code snippets */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Code Snippets</h2>
          <MyCodeGallery ref={galleryRef} />
        </div>
      </div>
    </div>
  );
}