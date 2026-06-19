import { Skeleton } from '@/components/ui/skeleton';

export function AIMonitorToggleSkeleton() {
  return (
    <div className="flex items-center gap-1.5 pointer-events-none select-none">
      {/* BotIcon Placeholder */}
      <Skeleton className="h-6 w-6 rounded" />

      {/* Switch Toggle Container Placeholder */}
      <Skeleton className="h-5 w-10 rounded-full" />
    </div>
  );
}
