'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Forces a fresh server fetch for the route this is rendered in, every
 * single time it mounts — i.e. every time the user navigates to this
 * page (via Link, router.push, or browser back/forward).
 *
 * Why this exists:
 * Next.js's App Router keeps a client-side "Router Cache" of pages you've
 * already visited so navigation feels instant. If you mutate data on one
 * page and only call router.refresh() there, that only re-fetches the
 * *current* page — any other already-visited page (like this one) can
 * keep serving its old cached snapshot until either its cache entry
 * expires or you do a full reload (which always bypasses the cache).
 *
 * Mounting this component guarantees this route re-requests fresh data
 * from the server on every visit, regardless of whatever the Router
 * Cache decided to serve first.
 */
export function RouteRefresher() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
