'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import authStore, { persistor } from '@/stores/auth.store';
import QueryProvider from './QueryProvider';

interface ProvidersProps {
  readonly children: ReactNode;
}

const LoadingComponent = () => (
  <div className="flex items-center justify-center h-screen">
    <div>Loading...</div>
  </div>
);

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <Provider store={authStore}>
        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </QueryProvider>
  );
}
