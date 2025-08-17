'use client';

import { PublicCodeGallery } from '../code/public-code-gallery';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth.hook';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../loading-screen';

const Dashboard: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="container mx-auto px-4 mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          {isAuthenticated && (
            <p className="text-gray-400">
              Welcome back, {user?.username ?? 'User'}!
            </p>
          )}
        </div>
        {/* Public Code Snippets */}
        <div className="mb-8">
          <PublicCodeGallery />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
