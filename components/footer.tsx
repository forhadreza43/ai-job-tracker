'use client';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { Skeleton } from './ui/skeleton';
import { CurrentYear } from './current-year';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) return null;
  return (
    <footer className="border-t border-border bg-background z-50 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left — brand */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              APPLI-TRACT
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs text-muted-foreground">
              Built by{' '}
              <a
                href="https://forhadreza.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-4"
              >
                Md. Forhad Reza
              </a>
            </span>
          </div>

          {/* Right — links */}
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="h-3" />

            <a
              href="mailto:forhad.bimt@gmail.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <Separator orientation="vertical" className="h-3" />
            <Suspense fallback={<Skeleton className="w-6 h-5" />}>
              <CurrentYear />
            </Suspense>
          </div>
        </div>
      </div>
    </footer>
  );
}
