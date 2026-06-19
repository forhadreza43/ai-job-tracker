import { Suspense } from 'react';
import { NotificationHistoryClient } from '@/components/notification-history-client';
import { HistoryIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <HistoryIcon className="size-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Notification History</h2>
      </div>
      {/* Data fetch client-side এ — Suspense boundary এর ভেতরে */}
      <Suspense fallback={<NotificationHistorySkeleton />}>
        <NotificationHistoryClient />
      </Suspense>
    </div>
  );
}

function NotificationHistorySkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}
