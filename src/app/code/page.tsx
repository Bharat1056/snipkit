'use client';

import { Button } from '@/components/ui/button';
import { Code, Plus, Upload, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CodePage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
            <Code className="w-8 h-8" />
            Public Code Gallery
          </h1>
          <p className="text-gray-400">
            Discover and explore public code snippets shared by the community.
            Browse JavaScript, TypeScript, Python, Go, and Rust code with syntax
            highlighting.
          </p>
        </div>

        {/* Call-to-action for authenticated users */}
        {session && (
          <div className="mb-12 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Ready to share your code?
                </h3>
                <p className="text-gray-400 text-sm">
                  Upload your own code snippets and manage them in your personal
                  space.
                </p>
              </div>
              <Link href="/me">
                <Button
                  variant="default"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Go to My Code
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Call-to-action for unauthenticated users */}
        {!session && (
          <div className="mb-12 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Want to share your own code?
                </h3>
                <p className="text-gray-400 text-sm">
                  Sign up to upload, manage, and share your code snippets with
                  the community.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/sign-up">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
