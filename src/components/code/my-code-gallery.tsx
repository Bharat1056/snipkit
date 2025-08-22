'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCode } from 'lucide-react';
import { CodeFileCard } from './code-card';
import { apiClient } from '@/axios';
import { CardLoadingGrid } from '@/components/common/card-loading';
import { DEFAULT_PAGE_SIZE, TAB_REFETCH_TIME } from '@/constants/file.constant';

interface CodeFile {
  title: string;
  description?: string;
  slug: string;
  access: string;
  createdAt: string;
  command: string;
  owner: {
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
  viewLink: string;
}

export interface MyCodeGalleryRef {
  refetch: () => void;
}

const MyCodeGallery = () => {
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const lastFetchedAt = useRef<number>(0);
  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(
        `/api/v1/web/folder/get-mine-code?pageIndex=${page}&pageSize=${DEFAULT_PAGE_SIZE}`
      );
      setCodeFiles(data?.codes ?? []);
      setTotal(data?.total ?? 0);
      lastFetchedAt.current = Date.now();
    } catch (e) {
      console.error('Error fetching public code snippets:', e);
      setError('Failed to load public code snippets');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastFetchedAt.current > TAB_REFETCH_TIME
      ) {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
            key={file.slug}
            file={file}
            onToggleAccess={() => {}}
            onDelete={() => {}}
            isOwner={true}
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
};

export { MyCodeGallery };
