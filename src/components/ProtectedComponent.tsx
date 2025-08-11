'use client';

import React from 'react';
import LoadingScreen from './loading-screen';
import { useAuth } from '@/hooks/auth.hook';
import { useRouter } from 'next/navigation';

export const ProtectedComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    router.push("/sign-in?callbackUrl=" + encodeURIComponent(window.location.href));
    return
  };

  return children;
};
