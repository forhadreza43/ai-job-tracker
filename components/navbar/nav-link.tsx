'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { menu } from './navbar.constants';
import { authClient } from '@/lib/auth-client';

export const NavLink = ({ flag }: { flag?: string }) => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  if (flag === 'small') {
    return menu.map((item, idx) => (
      <Link
        key={idx}
        href={item.url}
        className={cn(
          'flex w-full items-center gap-2 py-2 font-semibold duration-300 hover:text-primary',
          {
            'text-primary duration-300': item.url === pathname,
          }
        )}
      >
        {item.icon}
        {item.title}
      </Link>
    ));
  }
  return menu.map((item, idx) => (
    <Link
      key={idx}
      href={item.url}
      className={cn(
        'px-2 font-semibold decoration-2 underline-offset-4 duration-300 hover:underline',
        {
          'text-primary underline decoration-2 underline-offset-4 duration-300':
            item.url === pathname,
        },
        {
          hidden: item.url === '/dashboard' && !session?.user,
        }
      )}
    >
      {item.title}
    </Link>
  ));
};
