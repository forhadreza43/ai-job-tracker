'use client';
import { authClient } from '@/lib/auth-client';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NavLink } from './nav-link';
import DesktopNavProfile from './desktop-nav-profile';
import { Suspense } from 'react';
import MobileNavProfile from './mobile-nav-profile';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import MobileNavAction from './mobile-nav-action';
import { logo } from '@/components/navbar/navbar.constants';
import Logo from '@/components/navbar/logo';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  className?: string;
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  auth = {
    login: { title: 'Login', url: '/login' },
    signup: { title: 'Sign up', url: '#' },
  },
  className,
}: NavbarProps) => {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) return null;

  const { data: session } = authClient.useSession();
  return (
    <section
      className={cn(
        'py-4 shadow fixed top-0 w-full z-50 bg-white/70 backdrop-blur-sm',
        className
      )}
    >
      <div className="mx-auto container max-w-360 px-4 ">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold tracking-tighter">
                  {logo.title}
                </span>
                <span className="text-xs  tracking-tighter -mt-2">
                  {logo.subtitle}
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NavLink />
          </div>
          {session ? (
            // <SignOut />
            <DesktopNavProfile />
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm">
                <a href={auth.login.url}>{auth.login.title}</a>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    {session ? (
                      <MobileNavProfile />
                    ) : (
                      <Skeleton className="h-6 w-40" aria-hidden />
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="w-full border-b" />
                <div className="flex flex-col gap-3 p-4">
                  <NavLink flag={'small'} />
                </div>
                <div className="w-full border-b" />
                <div className="flex flex-col gap-3">
                  <Suspense
                    fallback={<Skeleton className="px-4 py-6" aria-hidden />}
                  >
                    <MobileNavAction />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
