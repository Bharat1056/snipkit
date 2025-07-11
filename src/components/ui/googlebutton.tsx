import React from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

interface GoogleSignInButtonProps {
  children: React.ReactNode;
  className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ children, className }) => {
  const loginWithGoogle = async (): Promise<void> => {
    try {

    //while in development, use localhost
    //in production, use the actual domain
      await signIn('google', { callbackUrl: 'http://localhost:3000/dashboard' });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <Button onClick={loginWithGoogle} className={`w-full ${className || ''}`}>
      {children}
    </Button>
  );
};

export default GoogleSignInButton;