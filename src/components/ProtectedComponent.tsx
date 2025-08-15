'use client';

import React from 'react';
import LoadingScreen from './loading-screen';
import { useAuth } from '@/hooks/auth.hook';
import { useRouter } from 'next/navigation';

type ProtectedComponentProps = {
  children: (props: { user: any }) => React.ReactNode;
};

export const ProtectedComponent = ({ children }: ProtectedComponentProps) => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    router.push(
      '/sign-in?callbackUrl=' + encodeURIComponent(window.location.href)
    );
    return null;
  }

  return <>{children({ user })}</>;
};
