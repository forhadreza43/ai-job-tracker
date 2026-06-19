'use client'

import { getAiMonitoringStatus, toggleAiMonitoring } from "@/actions/cron/userSetting.action";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { BotIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function AiToggleClient() {
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