'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, FileCode, Search, X } from 'lucide-react';
import { useAuth } from '@/hooks/auth.hook';
import { toast } from 'sonner';
import { CodeFileCard } from './code-card';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/loading-screen';

// Form validation schema
const searchFormSchema = z.object({
  search: z.string().min(0).max(100, 'Search term too long'),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

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

export const MyCodeGallery = forwardRef(function CodeGallery(_, ref) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSearch, setActiveSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 9;

  // React Hook Form setup
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: '',
    },
  });

  const { handleSubmit, control, reset, watch } = form;
  const watchedSearch = watch('search');

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

  const fetchCodeFiles = useCallback(
    async (reset = false) => {
      if (!isAuthenticated) return;
      if (!reset && (loadingMore || !hasMore)) return;

      if (reset) {
        setPage(1);
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let url = `/api/code/list?type=my&page=${reset ? 1 : page}&pageSize=${PAGE_SIZE}`;
        if (activeSearch) url += `&slug=${encodeURIComponent(activeSearch)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch code files');

        const data = await response.json();
        const newFiles = data.data ?? [];

        if (reset) {
          setCodeFiles(newFiles);
          setPage(2);
        } else {
          setCodeFiles(prev => [...prev, ...newFiles]);
          setPage(prev => prev + 1);
        }

        setHasMore(newFiles.length === PAGE_SIZE);
      } catch (error) {
        console.error('Error fetching code files:', error);
        setError('Failed to load code files');
        toast.error('Failed to load code files');
      } finally {
        if (reset) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [isAuthenticated, activeSearch, page, loadingMore, hasMore]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchCodeFiles(true);
    }
  }, [isAuthenticated, activeSearch]);

  useEffect(() => {
    if (loading || loadingMore || !hasMore || !loadMoreRef.current) return;

    const observerInstance = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) fetchCodeFiles();
    });

    observer.current = observerInstance;
    observerInstance.observe(loadMoreRef.current);

    return () => observerInstance.disconnect();
  }, [loading, loadingMore, hasMore, fetchCodeFiles]);

  useImperativeHandle(
    ref,
    () => ({
      refetch: () => fetchCodeFiles(true),
      clearSearch: () => {
        reset({ search: '' });
        setActiveSearch('');
      },
    }),
    [fetchCodeFiles, reset]
  );

  // Form submit handler
  const onSearchSubmit = (data: SearchFormValues) => {
    setActiveSearch(data.search);
  };

  // Clear search handler
  const handleClearSearch = () => {
    reset({ search: '' });
    setActiveSearch('');
  };

  // Quick search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSearchSubmit)();
    }
  };

  const handleToggleAccess = async (file: CodeFile) => {
    const originalAccess = file.access;
    const newAccess = originalAccess === 'public' ? 'private' : 'public';

    // Optimistic update
    setCodeFiles(prevFiles =>
      prevFiles.map(f => (f.id === file.id ? { ...f, access: newAccess } : f))
    );

    try {
      const response = await fetch('/api/code/access', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeId: file.id, access: newAccess }),
      });

      if (!response.ok) throw new Error('Failed to update access level');

      toast.success(`Snippet is now ${newAccess}`);
    } catch (error) {
      console.error('Error updating access level:', error);
      // Revert optimistic update
      setCodeFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === file.id ? { ...f, access: originalAccess } : f
        )
      );
      toast.error('Failed to update access. Please try again.');
    }
  };

  const handleDelete = async (file: CodeFile) => {
    setDeletingId(file.id);
    try {
      const res = await fetch('/api/code', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: file.id }),
      });

      if (!res.ok) throw new Error('Failed to delete code');

      setCodeFiles(prev => prev.filter(f => f.id !== file.id));
      toast.success('Code deleted successfully');
    } catch (error) {
      console.error('Error deleting code:', error);
      toast.error('Failed to delete code. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Search Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSearchSubmit)} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FormField
              control={control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Search by slug..."
                        {...field}
                        onKeyDown={handleKeyDown}
                        className="pr-10"
                      />
                      {watchedSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange('');
                            setActiveSearch('');
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
            {activeSearch && (
              <Button
                type="button"
                onClick={handleClearSearch}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Active Search Indicator */}
      {activeSearch && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              Searching for: <strong>"{activeSearch}"</strong>
            </span>
          </div>
          <Button
            onClick={handleClearSearch}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : codeFiles.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileCode className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {activeSearch ? 'No matching code files' : 'No code files yet'}
              </h3>
              <p className="text-muted-foreground">
                {activeSearch
                  ? `No code files found matching "${activeSearch}". Try a different search term.`
                  : 'Upload your first code file to get started.'}
              </p>
              {activeSearch && (
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codeFiles.map(file => (
              <CodeFileCard
                key={file.id}
                file={file}
                currentUser={user?.username ?? null}
                onToggleAccess={() => handleToggleAccess(file)}
                onDelete={() => handleDelete(file)}
                deletingId={deletingId}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
              />
            ))}
          </div>

          {/* Load More Trigger */}
          <div ref={loadMoreRef} />

          {loadingMore && (
            <div className="flex justify-center py-4">
              <Button disabled size="lg" className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading more...
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
});
