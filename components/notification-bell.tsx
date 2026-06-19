'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, BriefcaseIcon, HistoryIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { getActiveNotifications, dismissNotification } from '@/actions/notification/notification.action';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  // Also poll every 2 minutes in background for badge update
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    const result = await getActiveNotifications();
    if (result.success) {
      setNotifications(result.data as Notification[]);
    }
  }

  function handleDismiss(notificationId: string, jobId: string | null) {
    // Optimistically remove from list
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    startTransition(async () => {
      const result = await dismissNotification(notificationId);
      if (!result.success) {
        // Restore if failed
        fetchNotifications();
        toast.error('Failed to dismiss notification');
      } else if (jobId) {
        // Navigate to job details
        router.push(`/dashboard/manage-jobs/${jobId}`);
        setOpen(false);
      }
    });
  }

  const unreadCount = notifications.length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
              <BellIcon className="size-8 opacity-30" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors',
                      'flex flex-col gap-1',
                      isPending && 'opacity-60'
                    )}
                    onClick={() =>
                      handleDismiss(notification.id, notification.jobId)
                    }
                    disabled={isPending}
                  >
                    <div className="flex items-start gap-2">
                      <BriefcaseIcon className="size-3.5 mt-0.5 shrink-0 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">
                          {notification.title}
                        </p>
                        {notification.job && (
                          <p className="text-xs text-muted-foreground truncate">
                            {notification.job.company?.name} — {notification.job.title}
                          </p>
                        )}
                        <p className="text-xs text-foreground/70 mt-1 line-clamp-2 leading-snug">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(new Date(notification.createdAt))}
                      </span>
                      <span className="text-[10px] text-primary underline underline-offset-2">
                        View details →
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Footer */}
        <div className="p-2">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors"
          >
            <HistoryIcon className="size-3" />
            View notification history
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
