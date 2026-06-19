'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

// ─── Active (unread) notifications fetch ───────────────────────────────────
export async function getActiveNotifications() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, data: [] };

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        isRead: false,
        isArchived: false,
      },
      include: {
        job: { select: { id: true, title: true, company: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return { success: false, data: [] };
  }
}

// ─── Notification history (archived/read) fetch ────────────────────────────
export async function getNotificationHistory() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, data: [] };

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        OR: [{ isRead: true }, { isArchived: true }],
      },
      include: {
        job: { select: { id: true, title: true, company: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error('Failed to fetch notification history:', error);
    return { success: false, data: [] };
  }
}

// ─── Mark as read + archive (notification click এ call হবে) ────────────────
export async function dismissNotification(notificationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false };

  try {
    await prisma.notification.update({
      where: { id: notificationId, userId: session.user.id },
      data: { isRead: true, isArchived: true },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to dismiss notification:', error);
    return { success: false };
  }
}

// ─── Unread count only (badge এর জন্য) ────────────────────────────────────
export async function getUnreadCount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { count: 0 };

  try {
    const count = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false, isArchived: false },
    });
    return { count };
  } catch {
    return { count: 0 };
  }
}
