"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileCode, Search, Calendar, User, Eye, Download } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CodeFileCard } from "./code-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

export const MyCodeGallery = forwardRef(function CodeGallery(props, ref) {
  const { data: session } = useSession();
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 9;

  const fetchCodeFiles = useCallback(async (reset = false) => {
    if (!session?.user) return;
    if (!reset && loadingMore) return;
    if (!reset && !hasMore) return;
    if (reset) {
      setPage(1);
      setHasMore(true);
    }
    reset ? setLoading(true) : setLoadingMore(true);
    try {
      let url = `/api/code/list?type=my&page=${reset ? 1 : page}&pageSize=${PAGE_SIZE}`;
      if (search) url += `&slug=${encodeURIComponent(search)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch code files");
      const data = await response.json();
      reset
        ? setCodeFiles(data.data ?? [])
        : setCodeFiles((prev) => [...prev, ...(data.data ?? [])]);
      setHasMore((data.data?.length ?? 0) === PAGE_SIZE);
      reset ? setPage(2) : setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching code files:", error);
      setError("Failed to load code files");
    } finally {
      reset ? setLoading(false) : setLoadingMore(false);
    }
  }, [session, search, page, loadingMore, hasMore]);

  useEffect(() => {
    if (session?.user) fetchCodeFiles(true);
  }, [session, search]);

  useEffect(() => {
    if (loading || loadingMore || !hasMore || !loadMoreRef.current) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchCodeFiles();
    });
    observer.current.observe(loadMoreRef.current);
    return () => observer.current?.disconnect();
  }, [loading, loadingMore, hasMore, fetchCodeFiles]);

  useImperativeHandle(ref, () => ({ refetch: () => fetchCodeFiles(true) }), [fetchCodeFiles]);

  const handleToggleAccess = async (file: CodeFile) => {
    const originalAccess = file.access;
    const newAccess = originalAccess === "public" ? "private" : "public";

    setCodeFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === file.id ? { ...f, access: newAccess } : f
      )
    );

    try {
      const response = await fetch("/api/code/access", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeId: file.id, access: newAccess }),
      });

      if (!response.ok) {
        throw new Error("Failed to update access level");
      }

      toast.success(`Snippet is now ${newAccess}`);
    } catch (error) {
      setCodeFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id ? { ...f, access: originalAccess } : f
        )
      );
      toast.error("Failed to update access. Please try again.");
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
      setCodeFiles((prev) => prev.filter((f) => f.id !== file.id));
      toast.success("Code deleted");
    } catch (e) {
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
            <AlertDescription>Please sign in to view your code files.</AlertDescription>
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
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
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
              <p className="text-muted-foreground">Upload your first code file to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codeFiles.map((file) => (
              <CodeFileCard
                key={file.id}
                file={file}
                currentUser={session?.user?.username ?? null}
                onToggleAccess={() => handleToggleAccess(file)}
                onDelete={() => handleDelete(file)}
                deletingId={deletingId}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
              />
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