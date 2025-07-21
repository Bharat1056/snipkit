"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Copy, Check, Code2, Zap } from "lucide-react";
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
      JAVASCRIPT: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
      TYPESCRIPT: "border-blue-500/50 bg-blue-500/10 text-blue-400",
      PYTHON: "border-green-500/50 bg-green-500/10 text-green-400",
      GO: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400",
      RUST: "border-orange-500/50 bg-orange-500/10 text-orange-400",
      JSX: "border-purple-500/50 bg-purple-500/10 text-purple-400",
      TSX: "border-indigo-500/50 bg-indigo-500/10 text-indigo-400",
    };
    return colors[language.toUpperCase() as keyof typeof colors] || "border-gray-500/50 bg-gray-500/10 text-gray-400";
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
    <Card className="border-gray-600/30 bg-gray-800/60 backdrop-blur-md shadow-2xl">
      <CardHeader className="border-b border-gray-600/30 bg-gray-800/30 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">{filename}</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Code Viewer</p>
              </div>
            </div>
            <Badge 
              variant="outline"
              className={`${getLanguageColor(language)} backdrop-blur-sm font-medium`}
            >
              <Zap className="mr-1.5 h-3 w-3" />
              {language.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
            >
              {isCopied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadFile}
              disabled={isDownloading}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
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
      
      <CardContent className="p-0">
        <div className="rounded-b-xl overflow-hidden">
          <SyntaxHighlighter 
            language={language.toLowerCase()} 
            style={oneDark} 
            customStyle={{ 
              margin: 0, 
              padding: "1.5rem", 
              fontSize: "14px", 
              borderRadius: 0,
              background: "transparent",
              lineHeight: "1.6"
            }}
            showLineNumbers
            wrapLongLines
            lineNumberStyle={{
              minWidth: "3em",
              paddingRight: "1em",
              color: "#6b7280",
              borderRight: "1px solid #374151",
              marginRight: "1em"
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
} 