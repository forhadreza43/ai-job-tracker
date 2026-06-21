'use client';

import {
  getAiMonitoringStatus,
  toggleAiMonitoring,
} from '@/actions/cron/userSetting.action';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';
import { BotIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type MonitoringStatus = {
  isActive: boolean;
  hasGoogleAccount: boolean;
  lastChecked: Date | null;
};

export function AiToggleClient() {
  const [status, setStatus] = useState<MonitoringStatus | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAiMonitoringStatus().then((result) => {
      if (result.success && result.data) {
        setStatus({
          isActive: result.data.isAiMonitoringActive ?? false,
          hasGoogleAccount:
            'hasGoogleAccount' in result.data
              ? result.data.hasGoogleAccount
              : false,
          lastChecked: result.data.lastCheckedAt ?? null,
        });
      } else {
        setStatus({
          isActive: false,
          hasGoogleAccount: false,
          lastChecked: null,
        });
      }
    });
  }, []);

  const handleToggle = () => {
    if (!status) return;

    if (!status.hasGoogleAccount) {
      toast.error('AI Monitoring only work with google login', {
        description: 'Link Google to your account from Settings',
        action: {
          label: 'Settings',
          onClick: () => (window.location.href = '/dashboard/settings'),
        },
      });
      return;
    }

    const next = !status.isActive;
    setStatus((prev) => (prev ? { ...prev, isActive: next } : prev));

    startTransition(async () => {
      const result = await toggleAiMonitoring(next);
      if (!result.success) {
        setStatus((prev) => (prev ? { ...prev, isActive: !next } : prev));
        toast.error(result.error || 'Something went wrong');
      } else {
        toast.success(result.message);
      }
    });
  };

  if (status === null) {
    return <Skeleton className="h-5 w-9 rounded-full" />;
  }

  const { isActive, hasGoogleAccount, lastChecked } = status;

  const lastCheckedText = lastChecked
    ? `Last scanned: ${new Date(lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Never scanned';

  const tooltipText = !hasGoogleAccount
    ? 'Gmail monitoring only available for google login user'
    : isActive
      ? 'AI Monitoring ON'
      : 'AI Monitoring OFF';

  return (
    <div className="flex items-center gap-1.5">
      <BotIcon
        className={cn(
          'size-6 transition-colors',
          isActive && hasGoogleAccount
            ? 'text-primary'
            : 'text-muted-foreground'
        )}
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              role="switch"
              aria-checked={isActive}
              onClick={handleToggle}
              disabled={isPending} //|| !hasGoogleAccount
              className={cn(
                'relative inline-flex h-5 w-10 shrink-0 items-center rounded-full border-2 border-transparent',
                'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring focus-visible:ring-offset-2',
                !hasGoogleAccount
                  ? 'cursor-not-allowed opacity-40 bg-gray-300'
                  : isActive
                    ? 'cursor-pointer bg-primary'
                    : 'cursor-pointer bg-gray-300',
                isPending && 'opacity-50'
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
          <TooltipContent
            side="bottom"
            className="text-xs max-w-52 text-center"
          >
            <p className="font-medium">{tooltipText}</p>
            {hasGoogleAccount && (
              <p className="text-muted-foreground">{lastCheckedText}</p>
            )}
            {!hasGoogleAccount && (
              <p className="text-muted-foreground mt-0.5">
                Google login required
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
