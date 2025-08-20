'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCode } from 'lucide-react';
import { CodeFileCard } from './code-card'; // ✅ shared component
import { apiClient } from '@/axios';
import { CardLoadingGrid } from '@/components/common/card-loading';

interface CodeFile {
  id: string;
  title: string;
  description?: string;
  slug: string;
  access: string;
  createdAt: string;
  author: {
    username: string;
  };
  downloadUrl?: string;
  files: {
    id: string;
    name: string;
    key: string;
    signedUrl: string | null;
    size: number;
  }[];
}

export interface MyCodeGalleryRef {
  refetch: () => void;
}

const MyCodeGallery = forwardRef<MyCodeGalleryRef>((_, ref) => {
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(
        `/api/v1/web/folder/get-mine-code?pageIndex=${page}&pageSize=${PAGE_SIZE}`
      );
      setCodeFiles(data?.data?.codes ?? []);
      setTotal(data?.data?.total ?? 0);
    } catch (e) {
      console.error('Error fetching public code snippets:', e);
      setError('Failed to load public code snippets');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refetch: fetchData,
  }));

  useEffect(() => {
    fetchData();
  }, [page]);

  if (loading) {
    return <CardLoadingGrid rows={2} cols={3} />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-destructive font-medium">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (codeFiles.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-2">
          <FileCode className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="text-lg font-semibold">No code files yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload your first snippet!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {codeFiles.map(file => (
          <CodeFileCard
            key={file.id}
            file={file}
            currentUser={null}
            onToggleAccess={() => {}}
            onDelete={() => {}}
            deletingId={null}
            confirmDeleteId={null}
            setConfirmDeleteId={() => {}}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? 'default' : 'outline'}
            size="sm"
            className={`rounded-full ${page === i + 1 ? 'font-semibold' : ''}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
});

MyCodeGallery.displayName = 'MyCodeGallery';

export { MyCodeGallery };
