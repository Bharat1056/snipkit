'use client';

import {
  Eye,
  FileText,
  FileCode,
  User,
  Lock,
  Unlock,
  FolderOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { CodeFile } from '@/app/code/[username]/[codename]/page';
import { Folder, Author } from '@/app/code/[username]/[codename]/page';

interface ProjectDetailProps {
  folder: Folder;
  author: Author;
  files: CodeFile[];
}

export function ProjectDetail({ author, folder, files }: ProjectDetailProps) {
  const isPublic = folder?.access === 'public';
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Project Info Header */}
      <Card className="mb-8 border-gray-600/30 bg-gray-800/60 backdrop-blur-md">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-3xl font-bold text-white mb-2 leading-tight">
                {folder.title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                {folder.description}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`${
                isPublic
                  ? 'border-green-500/50 bg-green-500/10 text-green-400'
                  : 'border-orange-500/50 bg-orange-500/10 text-orange-400'
              } backdrop-blur-sm text-sm px-3 py-1`}
            >
              {isPublic ? (
                <Unlock className="mr-2 h-4 w-4" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-600/30">
              <User className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-gray-400 block">Author</span>
                <span className="text-white font-medium">
                  {author.username}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-600/30">
              <FolderOpen className="h-5 w-5 text-purple-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-gray-400 block">Download Path</span>
                <code className="text-white font-mono text-xs break-all bg-gray-800 px-2 py-1 rounded">
                  {folder.downloadPath}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Section */}
      {files.length === 0 ? (
        <Card className="border-gray-600/30 bg-gray-800/60 backdrop-blur-md">
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Files Found
            </h3>
            <p className="text-gray-400">
              This project doesn&apos;t contain any files yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">
              Project Files ({files.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map(file => (
              <Card
                key={file.key}
                className="group h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-gray-600/30 bg-gray-800/60 backdrop-blur-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle
                        className="text-base font-semibold text-white leading-tight truncate"
                        title={file.name}
                      >
                        {file.name}
                      </CardTitle>
                      <p className="text-xs text-gray-400 mt-1">{file.size}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-gray-900/50 border border-gray-600/30">
                      <span className="text-xs text-gray-400 block mb-1">
                        Path:
                      </span>
                      <code className="text-xs text-white font-mono break-all">
                        {`${file.path}`}
                      </code>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-600/30 bg-gray-800/30 backdrop-blur-sm pt-3">
                  <div className="flex items-center justify-between w-full gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(file.npmLink);
                        toast.success('CLI command copied!', {
                          description: `Copied: ${file.npmLink}`,
                        });
                      }}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10 flex-1"
                    >
                      <FileCode className="w-4 h-4 mr-2" />
                      CLI
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 flex-1"
                    >
                      <Link href={file.redirectLink}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
