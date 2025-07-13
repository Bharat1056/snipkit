"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  Eye,
  FileCode,
  Loader2,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import JSZip from "jszip";

export interface CodeCardProps {
  file: CodeFile;
  currentUser: string | null;
  onToggleAccess: (file: CodeFile) => void;
  onDelete: (file: CodeFile) => void;
  downloadingId: string | null;
  deletingId: string | null;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
  setDownloadingId: (id: string | null) => void;
}

export interface CodeFile {
  id: string;
  title: string;
  description?: string;
  slug: string;
  access: string;
  createdAt: string;
  author: {
    username: string;
  };
  files: {
    id: string;
    name: string;
    key: string;
    signedUrl: string | null;
    size: number;
  }[];
}

export function CodeFileCard({
  file,
  currentUser,
  onToggleAccess,
  onDelete,
  downloadingId,
  deletingId,
  confirmDeleteId,
  setConfirmDeleteId,
  setDownloadingId,
}: CodeCardProps) {
  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  return (
    <Card className="hover:shadow-sm transition-shadow border rounded-2xl p-4 space-y-3">
      <CardHeader className="p-0 flex items-center justify-between">
        <CardTitle className="text-base font-semibold truncate w-[70%]">
          {file.title}
        </CardTitle>

        {file.author.username === currentUser && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Switch
                checked={file.access === "public"}
                onCheckedChange={() => onToggleAccess(file)}
                id={`access-toggle-${file.id}`}
              />
              <label
                htmlFor={`access-toggle-${file.id}`}
                className="text-xs text-muted-foreground"
              >
                {file.access}
              </label>
            </div>

            <AlertDialog
              open={confirmDeleteId === file.id}
              onOpenChange={(open) =>
                setConfirmDeleteId(open ? file.id : null)
              }
            >
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === file.id}
                >
                  {deletingId === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this snippet?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the folder and files from S3.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(file)}
                    disabled={deletingId === file.id}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Files</p>
          <ul className="text-sm space-y-1">
            {file.files.map((f) => (
              <li key={f.id} className="flex items-center justify-between">
                <span className="truncate max-w-[75%]" title={f.name}>
                  {f.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    if (!f.signedUrl)
                      return toast.error("No download link available");
                    setDownloadingId(f.id);
                    try {
                      const res = await fetch(f.signedUrl);
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = f.name;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    } catch {
                      toast.error("Download failed");
                    } finally {
                      setDownloadingId(null);
                    }
                  }}
                  disabled={downloadingId === f.id}
                >
                  {downloadingId === f.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(file.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {file.author.username}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="icon" variant="outline">
              <Link
                href={`/code/${file.author.username}/${file.title}`}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `npx snipkit create ${file.slug.split("_").join("/")}`
                );
                toast.success("Command copied!");
              }}
            >
              <FileCode className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={async () => {
                if (!file.files.length)
                  return toast.error("No files to download");
                const zip = new JSZip();
                const folder = zip.folder(file.title || "snipkit-download")!;
                try {
                  for (const f of file.files) {
                    if (!f.signedUrl) continue;
                    const res = await fetch(f.signedUrl);
                    const blob = await res.blob();
                    folder.file(f.name, blob);
                  }
                  const content = await zip.generateAsync({ type: "blob" });
                  const url = window.URL.createObjectURL(content);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${file.title}.zip`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  toast.success("All files downloaded!");
                } catch {
                  toast.error("Failed to download all files");
                }
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}