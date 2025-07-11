"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  readonly code: string;
  readonly language: string;
  readonly filename: string;
  readonly downloadUrl: string;
}

export function CodeViewer({ code, language, filename, downloadUrl }: CodeViewerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const getLanguageColor = (language: string) => {
    const colors = {
      JAVASCRIPT: "bg-primary/10 text-primary transition-colors duration-300",
      TYPESCRIPT: "bg-primary/20 text-primary transition-colors duration-300",
      PYTHON: "bg-secondary/10 text-secondary transition-colors duration-300",
      GO: "bg-accent/10 text-accent transition-colors duration-300",
      RUST: "bg-destructive/10 text-destructive transition-colors duration-300",
    };
    return colors[language as keyof typeof colors] || "bg-muted text-foreground transition-colors duration-300";
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const downloadFile = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg">Code Viewer</CardTitle>
            <Badge className={getLanguageColor(language)}>
              {language}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
            >
              {isCopied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadFile}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-background rounded-lg p-0 overflow-x-auto transition-colors duration-300">
          <SyntaxHighlighter language={language.toLowerCase()} style={oneDark} customStyle={{ margin: 0, padding: 16, fontSize: 14, borderRadius: 8 }}>
            {code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
} 