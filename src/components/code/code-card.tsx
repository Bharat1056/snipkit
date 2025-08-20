'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Eye,
  FileCode,
  FileText,
  Loader2,
  Trash2,
  User,
  Lock,
  Unlock,
  Clock,
  Files,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export interface CodeCardProps {
  file: CodeFile;
  currentUser: string | null;
  onToggleAccess: (file: CodeFile) => void;
  onDelete: (file: CodeFile) => void;
  deletingId: string | null;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
}

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

export function CodeFileCard({
  file,
  currentUser,
  onToggleAccess,
  onDelete,
  deletingId,
  confirmDeleteId,
  setConfirmDeleteId,
}: CodeCardProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  console.log(file);
  const isOwner = file?.author?.username === currentUser;
  const isPublic = file.access === 'public';

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="group h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-gray-600/30 bg-gray-800/60 backdrop-blur-md">
        <CardHeader className="space-y-4 pb-4">
          {/* Header with Title and Access Toggle */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle
                className="text-lg font-bold text-white leading-tight truncate mb-2"
                title={file.title}
              >
                {file.title}
              </CardTitle>

              {/* Author and Date Info */}
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="font-medium">{file?.author?.username}</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Access Control */}
            {isOwner ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-600/50 bg-gray-700/50 backdrop-blur-sm py-2 px-3 transition-all hover:bg-gray-600/50"
                    onClick={() => onToggleAccess(file)}
                  >
                    <Switch
                      id={`access-toggle-${file.id}`}
                      checked={isPublic}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label
                      htmlFor={`access-toggle-${file.id}`}
                      className="cursor-pointer select-none text-sm font-medium text-white capitalize"
                    >
                      {file.access}
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Public/Private Access</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Badge
                variant="outline"
                className={`${
                  isPublic
                    ? 'border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                } backdrop-blur-sm`}
              >
                {isPublic ? (
                  <Unlock className="mr-1.5 h-3 w-3" />
                ) : (
                  <Lock className="mr-1.5 h-3 w-3" />
                )}
                {file.access}
              </Badge>
            )}
          </div>

          {/* Description if available */}
          {file.description && (
            <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
              {file.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pb-4">
          {/* Files Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Files className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">
                Files ({file?.files?.length})
              </span>
            </div>

            <div className="rounded-lg border border-gray-600/30 bg-gray-900/50 backdrop-blur-sm p-3">
              <div className="max-h-24 space-y-2 overflow-y-auto scrollbar-hidden">
                {file?.files?.map(f => (
                  <div
                    key={f?.id}
                    className="flex items-center gap-2 text-sm group/file"
                  >
                    <FileText className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                    <span
                      className="truncate text-gray-300 group-hover/file:text-white transition-colors"
                      title={f?.name}
                    >
                      {f?.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-600/30 bg-gray-800/30 backdrop-blur-sm pt-4">
          <div className="flex items-center justify-between w-full">
            {/* Delete Button for Owner */}
            {isOwner && (
              <AlertDialog
                open={confirmDeleteId === file.id}
                onOpenChange={open => setConfirmDeleteId(open ? file.id : null)}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    disabled={deletingId === file.id}
                  >
                    {deletingId === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-gray-600/50 bg-gray-800/90 backdrop-blur-sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action cannot be undone. This will permanently delete
                      &quot;{file.title}&quot; and all its files.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(file)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Link
                      href={`/code/${file?.author?.username}/${file?.slug}`}
                      aria-label={`View ${file?.title}`}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">View</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Code Snippet</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const command = `npx snipkit @${file.author.username}/${file.slug}`;
                      navigator.clipboard.writeText(command);
                      toast.success('CLI command copied!', {
                        description: `Copied: ${command}`,
                      });
                    }}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    aria-label="Copy CLI command"
                  >
                    <FileCode className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">CLI</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy CLI Command</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
