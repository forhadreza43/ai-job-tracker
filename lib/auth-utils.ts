'use client';

import { useEffect, useState } from 'react';
import { authClient } from './auth-client';
import type { Session } from './auth';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await authClient.getSession();
        setSession(response.data as Session | null);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  return { session, loading };
}

export async function getSession() {
  const response = await authClient.getSession();
  return response.data as Session | null;
}
