import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, CheckCircle, User, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CliLoginPageProps {
  searchParams: Promise<{ redirect_uri?: string }>;
}

export default async function CliLoginPage({
  searchParams,
}: CliLoginPageProps) {
  const params = await searchParams;
  const redirectUri = params.redirect_uri
    ? decodeURIComponent(params.redirect_uri)
    : '';

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect(
      '/sign-in?callbackUrl=' +
        encodeURIComponent(
          '/cli-login' +
            (redirectUri
              ? `?redirect_uri=${encodeURIComponent(redirectUri)}`
              : '')
        )
    );
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      username: true,
      email: true,
      fullName: true,
      createdAt: true,
    },
  });

  if (!user) {
    return redirect('/sign-in');
  }

  if (redirectUri) {
    const finalRedirectUrl = `${redirectUri}${redirectUri.includes('?') ? '&' : '?'}username=${encodeURIComponent(user.username)}`;
    return redirect(finalRedirectUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CLI Authentication Successful
            </CardTitle>

            <CardDescription>
              You are now authenticated for CLI access to Snipkit.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Account Details
                </span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-700 hover:bg-green-100"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-700">{user.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Code className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-700">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild variant="gradient" size="lg" className="w-full">
                <a href="/dashboard">
                  <Code className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </a>
              </Button>

              <Button
                asChild
                variant="auth-secondary"
                size="lg"
                className="w-full"
              >
                <Link href="/me">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Code Snippets
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                CLI authentication is now complete. You can close this window
                and return to your terminal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
