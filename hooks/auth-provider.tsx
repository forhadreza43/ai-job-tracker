'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useTransition,
  useState,
} from 'react';
import { authClient } from '@/lib/auth-client';
import { BetterFetchError } from 'better-auth/react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: typeof authClient.$Infer.Session.user | null;
  session: typeof authClient.$Infer.Session.session | null;
  isPending: boolean;
  error: BetterFetchError | string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [error, setError] = useState<BetterFetchError | string | null>(null);
  const [isSignOutPending, startSignOutTransition] = useTransition();
  const {
    data: sessionData,
    isPending: isSessionPending,
    error: sessionError,
  } = authClient.useSession();

  const isPending = isSessionPending || isSignOutPending;
  if (sessionError) {
    setError(sessionError);
  }

  const logout = async () => {
    setError(null);
    startSignOutTransition(async () => {
      try {
        const result = await authClient.signOut();
        if (result?.error) {
          setError(result.error.message || 'Failed to sign out.');
          return;
        }

        router.push('/');
        router.refresh();
      } catch (err) {
        console.error('Logout failed:', err);
        setError('An unexpected error occurred during sign out.');
      }
    });
  };

  const value: AuthContextType = {
    user: sessionData?.user ?? null,
    session: sessionData?.session ?? null,
    isPending,
    error,
    logout,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
