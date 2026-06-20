'use client';

import { useState, useEffect } from 'react';
import { getNotificationHistory } from '@/actions/notification/notification.action';
import { BriefcaseIcon, InboxIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: Date;
  jobId: string | null;
  job: {
    id: string;
    title: string;
    company: { name: string } | null;
  } | null;
};

export function NotificationHistory() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotificationHistory().then((result) => {
      if (result.success) {
        setNotifications(result.data as Notification[]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 py-16 text-muted-foreground px-4 text-center">
        <InboxIcon className="size-10 opacity-30" />
        <p className="text-sm">No notification history yet.</p>
        <p className="text-xs">
          Turn on AI Monitoring to start receiving interview & assessment alerts.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Badge variant="outline">{notifications.length} total</Badge>
      </div>
      <ul className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <Card className="px-4 py-3 flex flex-col gap-1 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-start gap-2">
                <BriefcaseIcon className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <Badge variant="outline" className="text-[10px] py-0">
                      {notification.type}
                    </Badge>
                  </div>
                  {notification.job && (
                    <p className="text-xs text-muted-foreground">
                      {notification.job.company?.name} — {notification.job.title}
                    </p>
                  )}
                  <p className="text-xs text-foreground/70 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 pl-5">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
                {notification.jobId && (
                  <Link
                    href={`/dashboard/manage-jobs/${notification.jobId}`}
                    className="text-[11px] text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    View job →
                  </Link>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
