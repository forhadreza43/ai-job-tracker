'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function toggleAiMonitoring(isActive: boolean) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized. Please login first.' };
    }

    const userId = session.user.id;

    if (isActive) {
      const googleAccount = await prisma.account.findFirst({
        where: { userId, providerId: 'google' },
      });

      if (!googleAccount) {
        return {
          success: false,
          error:
            'Gmail monitoring এর জন্য প্রথমে Google দিয়ে লগইন বা অ্যাকাউন্ট লিংক করতে হবে।',
        };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isAiMonitoringActive: isActive,
        ...(isActive ? {} : { lastCheckedAt: null }),
      },
    });

    revalidatePath('/');

    return {
      success: true,
      message: isActive
        ? 'AI Inbox Monitoring successfully activated.'
        : 'AI Inbox Monitoring successfully deactivated.',
    };
  } catch (error) {
    console.error('Failed to toggle AI monitoring:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

export async function getAiMonitoringStatus(): Promise<{
  success: boolean;
  error?: string;
  data?: {
    isAiMonitoringActive: boolean;
    lastCheckedAt: Date | null;
    hasGoogleAccount: boolean;
  };
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const [user, googleAccount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isAiMonitoringActive: true, lastCheckedAt: true },
      }),
      prisma.account.findFirst({
        where: { userId: session.user.id, providerId: 'google' },
        select: { id: true },
      }),
    ]);

    return {
      success: true,
      data: {
        isAiMonitoringActive: user?.isAiMonitoringActive ?? false,
        lastCheckedAt: user?.lastCheckedAt ?? null,
        hasGoogleAccount: !!googleAccount,
      },
    };
  } catch (error) {
    console.error('Failed to fetch AI status:', error);
    return { success: false, error: 'Failed to load status' };
  }
}
