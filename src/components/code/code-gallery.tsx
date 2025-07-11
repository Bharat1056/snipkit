"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileCode, Download, Eye, Calendar, User, Search, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CodeFile {
  id: string;
  title: string;
  description?: string;
  slug: string;
  language: string;
  exploitLocation: string;
  access: string;
  createdAt: string;
  user: {
    username: string;
  };
  downloadUrl?: string;
}


// Language color mapping (GitHub linguist colors)
const LANGUAGE_COLORS: Record<string, string> = {
  JAVASCRIPT: "#f1e05a",
  TYPESCRIPT: "#3178c6",
  PYTHON: "#3572A5",
  GO: "#00ADD8",
  RUST: "#dea584",
  JAVA: "#b07219",
  "C++": "#f34b7d",
  JSON: "#292929",
  TEXT: "#cccccc",
};

const getLanguageColor = (language: string) => {
  return LANGUAGE_COLORS[language.toUpperCase()] || "#cccccc";
};

export const CodeGallery = forwardRef(function CodeGallery(props, ref) {
  const { data: session } = useSession();
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 10;

  // Fetch code files with pagination
  const fetchCodeFiles = useCallback(async (reset = false) => {
    if (!session?.user) return;
    if (!reset && loadingMore) return;
    if (!reset && !hasMore) return;
    if (reset) {
      setPage(1);
      setHasMore(true);
    }
    if (reset) setLoading(true);
    else setLoadingMore(true);
    try {
      let url = `/api/code/list?page=${reset ? 1 : page}&pageSize=${PAGE_SIZE}`;
    if (search) {
        url += `&slug=${encodeURIComponent(search)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch code files");
      }
      const data = await response.json();
      if (reset) {
      setCodeFiles(data.code ?? []);
      } else {
        setCodeFiles(prev => [...prev, ...(data.code ?? [])]);
      }
      setHasMore((data.code?.length ?? 0) === PAGE_SIZE);
      if (reset) setPage(2);
      else setPage(prev => prev + 1);
    } catch (error) {
      console.error("Error fetching code files:", error);
      setError("Failed to load code files");
    } finally {
      if (reset) setLoading(false);
      else setLoadingMore(false);
    }
  }, [session, search, page, loadingMore, hasMore]);

  // Initial and search effect
  useEffect(() => {
    if (session?.user) {
      fetchCodeFiles(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, search]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || loadingMore) return;
    if (!hasMore) return;
    if (!loadMoreRef.current) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchCodeFiles();
      }
    });
    observer.current.observe(loadMoreRef.current);
    return () => { if (observer.current) observer.current.disconnect(); };
  }, [loading, loadingMore, hasMore, fetchCodeFiles]);

  useImperativeHandle(ref, () => ({
    refetch: () => fetchCodeFiles(true)
  }), [fetchCodeFiles]);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownload = async (file: CodeFile) => {
    if (!file.downloadUrl) return;
    setDownloadingId(file.id);
    try {
      const response = await fetch(file.downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleToggleAccess = async (file: CodeFile) => {
    const newAccess = file.access === "public" ? "private" : "public";
    // Optimistically update UI
    setCodeFiles(prev => prev.map(f => f.id === file.id ? { ...f, access: newAccess } : f));
    try {
      const res = await fetch("/api/code", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id, access: newAccess }),
      });
      if (!res.ok) throw new Error("Failed to update access");
      // No need to update state again, already done optimistically
    } catch (e) {
      // Revert change if API fails
      setCodeFiles(prev => prev.map(f => f.id === file.id ? { ...f, access: file.access } : f));
      console.error("Error updating access:", e);
      toast.error("Failed to update access");
    }
  };

  const handleDelete = async (file: CodeFile) => {
    setDeletingId(file.id);
    try {
      const res = await fetch("/api/code", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id }),
      });
      if (!res.ok) throw new Error("Failed to delete code");
      setCodeFiles(prev => prev.filter(f => f.id !== file.id));
      toast.success("Code deleted");
    } catch (e) {
      console.error("Error deleting code:", e);
      toast.error("Failed to delete code");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Please sign in to view your code files.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by slug..."
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setSearch(searchInput); }}
          />
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button onClick={() => setSearch(searchInput)} variant="outline">Search</Button>
        <Button onClick={() => { setSearch(""); setSearchInput(""); }} variant="ghost">Clear</Button>
      </div>
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
              <h3 className="text-lg font-semibold mb-2">No code files yet</h3>
              <p className="text-muted-foreground">
                Upload your first code file to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codeFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{file.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {file.description || "No description provided"}
                  </CardDescription>
                </div>
                {file.user.username === session?.user?.username && (
                  <div className="flex items-center gap-2 mt-2">
                    <Switch
                      checked={file.access === "public"}
                      onCheckedChange={() => handleToggleAccess(file)}
                      id={`access-toggle-${file.id}`}
                      className="cursor-pointer"
                    />
                    <label htmlFor={`access-toggle-${file.id}`} className="text-xs">
                      {file.access === "public" ? "Public" : "Private"}
                    </label>
                    <AlertDialog open={confirmDeleteId === file.id} onOpenChange={open => setConfirmDeleteId(open ? file.id : null)}>
                      <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" disabled={deletingId === file.id} className="cursor-pointer" aria-label="Delete code snippet">
                              {deletingId === file.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this code snippet?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the code snippet and its file from S3.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(file)} disabled={deletingId === file.id}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* File Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-muted mr-1"
                          style={{ backgroundColor: getLanguageColor(file.language) }}
                          title={file.language}
                        />
                        <Badge variant="outline">{file.language}</Badge>
                      </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                    <Button asChild size="icon" variant="outline" aria-label="View">
                    <Link href={`/code/${file.user.username}/${file.slug.split("_")[1]}`}>
                          <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                      <Button size="icon" variant="outline" aria-label="Download" onClick={() => handleDownload(file)} disabled={downloadingId === file.id}>
                    {downloadingId === file.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                          <Download className="h-4 w-4" />
                    )}
                  </Button>
                      <Button size="icon" variant="outline" aria-label="Copy" onClick={() => {
                    navigator.clipboard.writeText(`npx snipkit create ${file.slug.split("_").join("/")}`);
                    toast.success("Command copied!");
                  }}>
                        <FileCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div ref={loadMoreRef} />
          {loadingMore && (
            <div className="flex justify-center py-4">
              <Button disabled size="lg" className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

interface PublicCodeFile {
  id: string;
  title: string;
  description?: string;
  slug: string;
  language: string;
  exploitLocation: string;
  access: string;
  createdAt: string;
  user: {
    username: string;
  };
  downloadUrl?: string;
}

export function PublicCodeGallery() {
  const [codeFiles, setCodeFiles] = useState<PublicCodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchPublicCodes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/code/list?access=public&page=${page}&pageSize=${PAGE_SIZE}`);
        if (!res.ok) throw new Error("Failed to fetch public code snippets");
        const data = await res.json();
        setCodeFiles(data.code ?? []);
        setTotal(data.total ?? 0);
      } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        setError("Failed to load public code snippets");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicCodes();
  }, [page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownload = async (file: PublicCodeFile) => {
    if (!file.downloadUrl) return;
    setDownloadingId(file.id);
    try {
      const response = await fetch(file.downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      setDownloadingId(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Public Code Snippets</h2>
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
            <div className="text-center py-8 text-red-500">{error}</div>
          </CardContent>
        </Card>
      ) : codeFiles.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileCode className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No public code files yet</h3>
              <p className="text-muted-foreground">
                Be the first to upload a public code file!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{file.title}</CardTitle>
                      <CardDescription className="mt-1 text-wrap break-words">
                        {file.description || "No description provided"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 break-words overflow-hidden">
                  <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <span
                            className="inline-block w-3 h-3 rounded-full border border-muted mr-1"
                            style={{ backgroundColor: getLanguageColor(file.language) }}
                            title={file.language}
                          />
                          <Badge variant="outline">{file.language}</Badge>
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(file.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{file.user.username}</span>
                        </div>
                      </div>
                    <div className="flex items-center gap-2 pt-2">
                          <Button asChild size="icon" variant="outline" aria-label="View">
                            <Link href={`/code/${file.user.username}/${file.slug.split("_")[1]}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="outline" aria-label="Download" onClick={() => handleDownload(file)} disabled={downloadingId === file.id}>
                            {downloadingId === file.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                      </Button>
                    </div>
                 </div>
              </CardContent>
            </Card>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${page === i + 1 ? 'font-bold' : ''}`}
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
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 