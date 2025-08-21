'use client';

import { Card, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
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
import { Eye, FileCode, Trash2, User, Lock, Unlock, Clock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export interface CodeCardProps {
  file: CodeFile;
  onToggleAccess: (file: CodeFile) => void;
  onDelete: (file: CodeFile) => void;
  isOwner?: boolean;
}

interface CodeFile {
  title: string;
  description?: string;
  slug: string;
  access: string;
  createdAt: string;
  command: string;
  owner: {
    username: string;
    fullName: string;
    email: string;
    role: string;
  };
  viewLink: string;
}

export function CodeFileCard({
  file,
  onToggleAccess,
  onDelete,
  isOwner = false,
}: CodeCardProps) {
  const isPublic = file.access === 'public';

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="group h-full border border-gray-700/40 bg-gray-800/70 backdrop-blur-md rounded-xl shadow-sm hover:shadow-lg hover:border-gray-600/60 transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Title + Meta */}
            <div className="flex-1 min-w-0">
              <CardTitle
                className="text-base font-semibold text-white truncate"
                title={file.title}
              >
                {file.title}
              </CardTitle>
              <div className="mt-1 flex justify-start md:items-center gap-3 text-xs text-gray-400 flex-col md:flex-row">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-400" />
                  <span>{file?.owner?.username}</span>
                </div>
                <span className="w-1 h-1 bg-gray-500 rounded-full hidden md:block" />
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-green-400" />
                  <span>{file.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Access */}
            {isOwner ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-600/50 bg-gray-700/40 px-2.5 py-1.5 transition-all hover:bg-gray-600/40"
                    onClick={() => onToggleAccess(file)}
                  >
                    <Switch
                      id={`access-toggle-${file.slug}`}
                      checked={isPublic}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label
                      htmlFor={`access-toggle-${file.slug}`}
                      className="text-xs text-white capitalize"
                    >
                      {file.access}
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Public/Private</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Badge
                variant="outline"
                className={`${
                  isPublic
                    ? 'border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                } text-xs`}
              >
                {isPublic ? (
                  <Unlock className="mr-1 h-3 w-3" />
                ) : (
                  <Lock className="mr-1 h-3 w-3" />
                )}
                {file.access}
              </Badge>
            )}
          </div>

          {file.description && (
            <p className="mt-2 text-sm text-gray-300 line-clamp-2 leading-snug">
              {file.description}
            </p>
          )}
        </CardHeader>

        <CardFooter className="flex justify-between border-t border-gray-700/40 bg-gray-800/50 pt-3">
          {/* Delete (Owner only) */}
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-1.5 hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-gray-700 bg-gray-800/90 backdrop-blur-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Delete “{file.title}”?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. It will permanently remove
                    this snippet and its files.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600">
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

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <Link href={file.viewLink} aria-label={`View ${file.title}`}>
                    <Eye className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">View</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(file.command);
                    toast.success('CLI command copied!', {
                      description: `Copied: ${file.command}`,
                    });
                  }}
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  aria-label="Copy CLI command"
                >
                  <FileCode className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">CLI</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy CLI Command</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
