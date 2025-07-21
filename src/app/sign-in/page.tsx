import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <Suspense
      fallback={<div className="text-center text-white">Loading...</div>}
    >
      <SignInForm />
    </Suspense>
  );
}
