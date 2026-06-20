import { Suspense } from 'react';
import { NotificationHistory } from '@/components/notification-history';
import { HistoryIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification History',
  description:
    'See a complete history of interview and assessment notifications detected in your inbox.',
};

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-2">
        <HistoryIcon className="size-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Notification History</h2>
      </div>
      <Suspense fallback={<NotificationHistorySkeleton />}>
        <NotificationHistory />
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
