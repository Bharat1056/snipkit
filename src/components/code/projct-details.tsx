"use client";

import { Eye, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface File {
  id: string;
  name: string;
  key: string;
  signedUrl: string | null;
  size: number;
}

interface ProjectDetailProps {
  username: string;
  title: string;
  description: string | null;
  downloadPath: string;
  access: string;
  files: File[];
}

export function ProjectDetail({
  username,
  title,
  description,
  downloadPath,
  access,
  files,
}: ProjectDetailProps) {
  const handleDownload = async (file: File) => {
    if (!file.signedUrl) {
      return toast.error("No download link available");
    }
    try {
      const res = await fetch(file.signedUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            {description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>👤 Username:</strong> {username}
          </p>
          <p>
            <strong>📁 Download Path:</strong>{" "}
            <code className="break-all">{downloadPath}</code>
          </p>
          <p>
            <strong>🔒 Access:</strong>{" "}
            <Badge variant={access === "public" ? "default" : "secondary"}>
              {access}
            </Badge>
          </p>
        </CardContent>
      </Card>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">
          No files found in this project.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <Card key={file.id} className="shadow-sm hover:shadow transition-all h-full">
              <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{file.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/code/${username}/${title}/${file.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground flex flex-col gap-1">
                <span className="truncate" title={file.key}>
                  <strong>Path:</strong> {file.key}
                </span>
                <span>
                  <strong>Size:</strong> {file.size} bytes
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}