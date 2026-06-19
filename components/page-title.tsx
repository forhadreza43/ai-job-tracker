'use client';
import { usePathname } from 'next/navigation';

export function PageTitle() {
  const pathname = usePathname()?.split('/')[2] || 'dashboard';
  const title = pathname.includes('-')
    ? pathname
        .split('-')
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    : pathname[0].toUpperCase() + pathname.slice(1);
  return <h1 className="text-base font-medium flex-1">{title}</h1>;
}
