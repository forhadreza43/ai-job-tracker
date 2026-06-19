'use client';

import { useState, useTransition } from 'react';
import { toggleAiMonitoring } from '@/actions/cron/userSetting.action';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BotIcon } from 'lucide-react';

interface AiToggleProps {
  initialStatus: boolean;
  lastChecked: Date | null;
}

export function AiMonitoringToggle({
  initialStatus,
  lastChecked,
}: AiToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(initialStatus);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    startTransition(async () => {
      const result = await toggleAiMonitoring(checked);
      if (!result.success) {
        setIsActive(!checked);
        toast.error(result.error || 'Something went wrong');
      } else {
        toast.success(result.message);
      }
    });
  };

  const lastCheckedText = lastChecked
    ? `Last scanned: ${new Date(lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Never scanned';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-default">
            <BotIcon
              className={`size-3.5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            />
            <Switch
              checked={isActive}
              disabled={isPending}
              onCheckedChange={handleToggle}
            />
            <Switch className="scale-200 bg-red-500" />
            <span>S</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-medium">
            {isActive ? 'AI Monitoring ON' : 'AI Monitoring OFF'}
          </p>
          <p className="text-muted-foreground">{lastCheckedText}</p>
          {!isActive && (
            <p className="text-muted-foreground mt-0.5">
              Requires Google login
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
