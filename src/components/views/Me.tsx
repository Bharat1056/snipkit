'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CodeUpload } from '@/components/code/code-upload';
import { MyCodeGallery } from '@/components/code/my-code-gallery';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Code, User } from 'lucide-react';
import LoadingScreen from '@/components/loading-screen';
import { useAuth } from '@/hooks/auth.hook';

interface CodeGalleryRef {
  refetch: () => void;
}

export default function MePage({ user }: { user: any }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isWriteModalOpen, setWriteModalOpen] = useState(false);
  const galleryRef = useRef<CodeGalleryRef>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleUploadComplete = () => {
    setOpen(false);
    if (galleryRef.current) {
      galleryRef.current.refetch();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
            <User className="w-8 h-8" />
            My Code Snippets
          </h1>
          <p className="text-gray-400">
            Upload, view, and manage your personal code files.
          </p>
        </div>

        {/* Upload and Write buttons */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Code
              </Button>
            </DialogTrigger>
            <DialogContent
              className="p-0 w-full max-w-[95vw] md:max-w-xl max-h-[90vh] rounded-2xl shadow-xl bg-background overflow-y-auto scrollbar-none"
              style={{ border: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              <div className="w-full flex flex-col items-center justify-center p-6">
                <CodeUpload onUploadComplete={handleUploadComplete} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Code snippets */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Your Code Snippets
          </h2>
          <MyCodeGallery ref={galleryRef} />
        </div>
      </div>
    </div>
  );
}
