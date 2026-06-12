'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname()?.split('/')[2] || 'dashboard';
  const title = pathname.includes('-') ? pathname.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') : pathname[0].toUpperCase() + pathname.slice(1);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 mt-1.5 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {title}
        </h1>
      </div>
    </header>
  );
}
