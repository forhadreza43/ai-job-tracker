'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotificationBell } from '@/components/notification-bell';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getAiMonitoringStatus,
  toggleAiMonitoring,
} from '@/actions/cron/userSetting.action';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useTransition, Suspense } from 'react';
import { BotIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
function PageTitle() {
  const pathname = usePathname()?.split('/')[2] || 'dashboard';
  const title = pathname.includes('-')
    ? pathname
        .split('-')
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    : pathname[0].toUpperCase() + pathname.slice(1);
  return <h1 className="text-base font-medium flex-1">{title}</h1>;
}

function AiToggleClient() {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAiMonitoringStatus().then((result) => {
      if (result.success && result.data) {
        setIsActive(result.data.isAiMonitoringActive ?? false);
        setLastChecked(result.data.lastCheckedAt ?? null);
      } else {
        setIsActive(false);
      }
    });
  }, []);

  const handleToggle = () => {
    if (isActive === null) return;
    const next = !isActive;
    setIsActive(next);
    startTransition(async () => {
      const result = await toggleAiMonitoring(next);
      if (!result.success) {
        setIsActive(!next);
        toast.error(result.error || 'Something went wrong');
      } else {
        toast.success(result.message);
      }
    });
  };

  const lastCheckedText = lastChecked
    ? `Last scanned: ${new Date(lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Never scanned';

  if (isActive === null) {
    return <Skeleton className="h-5 w-9 rounded-full" />;
  }

  return (
    <div className="flex items-center gap-1.5">
      <BotIcon
        className={cn(
          'size-6 transition-colors',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              role="switch"
              aria-checked={isActive}
              onClick={handleToggle}
              disabled={isPending}
              className={cn(
                'relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
                'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50',
                isActive ? 'bg-primary' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 transform', 
                  isActive ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p className="font-medium">
              {isActive ? 'AI Monitoring ON' : 'AI Monitoring OFF'}
            </p>
            <p className="text-muted-foreground">{lastCheckedText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 mt-1.5 data-[orientation=vertical]:h-4"
        />
        <Suspense
          fallback={<Skeleton className="h-5 w-24 rounded-md flex-1" />}
        >
          <PageTitle />
        </Suspense>
        <div className="flex items-center gap-3">
          <Suspense fallback={<Skeleton className="h-5 w-9 rounded-full" />}>
            <AiToggleClient />
          </Suspense>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
