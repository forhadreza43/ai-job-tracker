import { SignupForm } from '@/components/auth/signup-form';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense
          fallback={
            <div className="h-10 w-32 bg-gray-300 rounded-md animate-pulse mb-6" />
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
