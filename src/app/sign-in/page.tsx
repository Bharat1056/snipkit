import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';
import LoadingScreen from '@/components/loading-screen';

export default function SignInPage() {
  return (
    <Suspense
      fallback={<LoadingScreen />}
    >
      <SignInForm />
    </Suspense>
  );
}
