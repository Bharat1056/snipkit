'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { signInSchema, type SignInFormData } from '@/types/auth.type';
import { authConfig } from '@/config/auth.config';
import { useAuth } from '@/hooks/auth.hook';
import { MAX_ATTEMPTS } from '@/constants/auth.constant';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { setAuth, user } = useAuth();


  const isBlocked = attemptCount >= MAX_ATTEMPTS;

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.replace(callbackUrl);
    }
  }, [user, router, callbackUrl]);

  const onSubmit = async (data: SignInFormData) => {
    if (isBlocked) {
      setError('Too many failed attempts. Please try again later.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await authConfig.login(data);
      const me = await authConfig.me();

      if (!me?.user || !me?.session) {
        throw new Error('Failed to retrieve user session after login.');
      }

      const { user: userData, session } = me;
      setAuth({
        ...userData,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
      });

      router.replace(callbackUrl);
    } catch (err: any) {
      // Check for specific authentication error (e.g., 401 Unauthorized)
      if (err?.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
        setAttemptCount(prev => prev + 1);
      } else {
        // Handle other errors (network, server, etc.) more gracefully
        setError('An unexpected error occurred. Please try again.');
        console.error('Sign-in error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-700/50 shadow-2xl bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-red-700 bg-red-900/20"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            disabled={isLoading || isBlocked}
                            className="pl-10 h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            disabled={isLoading || isBlocked}
                            className="pl-10 pr-12 h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading || isBlocked}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-700/50"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {attemptCount > 0 && !isBlocked && (
                  <Alert className="border-orange-600 bg-orange-900/20">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <AlertDescription className="text-orange-400">
                      {MAX_ATTEMPTS - attemptCount} attempt
                      {MAX_ATTEMPTS - attemptCount > 1 ? 's' : ''} remaining.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading || isBlocked}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-800 px-2 text-gray-500">
                      New to our platform?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full border-gray-600 bg-gray-900/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  asChild
                >
                  <Link href="/sign-up">Create an Account</Link>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link
              href="/terms-of-service"
              className="text-blue-400 hover:underline font-medium"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy-policy"
              className="text-blue-400 hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
