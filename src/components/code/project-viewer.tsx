'use client';

import { Button } from '../ui/button';
import {
  Download,
  Calendar,
  User,
  Code2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TerminalCommand } from '../ui/terminal-command';
import { useState } from 'react';

interface FileViewerProps {
  readonly code: string;
  readonly filename: string;
  readonly author: string;
  readonly createdAt: string;
  readonly downloadUrl: string;
  readonly path: string;
}

export function FileViewer({
  code,
  filename,
  author,
  createdAt,
  downloadUrl,
  path,
}: FileViewerProps) {
  const command = `npx snipkit @${author}/${path}`;
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* File Info Header */}
        <Card className="border-gray-600/30 bg-gray-800/60 backdrop-blur-md">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl font-bold text-white mb-2 truncate">
                  {filename}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="font-medium">{author}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-600/30">
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <a href={downloadUrl} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </a>
              </Button>

              <div className="min-w-0">
                <TerminalCommand command={command} />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Code Display */}
        <Card className="border-gray-600/30 bg-gray-800/60 backdrop-blur-md shadow-2xl">
          <CardHeader className="border-b border-gray-600/30 bg-gray-800/30 backdrop-blur-sm pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Source Code
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    Interactive code viewer with syntax highlighting
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCopyCode}
                size="sm"
                variant="outline"
                className="border-gray-600/30 bg-gray-700/50 hover:bg-gray-600/50 text-white hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="max-h-[70vh] overflow-y-auto scrollbar-hidden">
              <SyntaxHighlighter
                language="tsx"
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
                showLineNumbers
                wrapLongLines
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  color: '#6b7280',
                  borderRight: '1px solid #374151',
                  marginRight: '1em',
                }}
              >
                {code}
              </SyntaxHighlighter>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
