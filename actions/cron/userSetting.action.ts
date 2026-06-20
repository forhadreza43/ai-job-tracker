'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth'; // Better Auth instance
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * AI Inbox Monitoring Toggle করার জন্য Server Action
 * @param isActive boolean - AI monitoring চালু বা বন্ধ করার স্টেট
 */
export async function toggleAiMonitoring(isActive: boolean) {
  try {
    // ১. Better Auth থেকে কারেন্ট লগইনড ইউজার সেশন চেক করা
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: 'Unauthorized. Please login first.',
      };
    }

    const userId = session.user.id;

    // ২. যদি মনিটরিং অন করতে চায়, তবে চেক করা যে গুগলের অ্যাকাউন্ট লিংকড আছে কিনা
    if (isActive) {
      const googleAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: 'google',
        },
      });

      if (!googleAccount) {
        return {
          success: false,
          error:
            'Gmail monitoring এর জন্য প্রথমে Google দিয়ে লগইন বা অ্যাকাউন্ট লিংক করতে হবে।',
        };
      }
    }

    // ৩. ইউজারের ডেটাবেস ফিল্ড আপডেট করা
    await prisma.user.update({
      where: { id: userId },
      data: {
        isAiMonitoringActive: isActive,
        // যদি বন্ধ করে দেয়, তবে লাস্ট চেক টাইম নাল করে দিতে পারেন (ঐচ্ছিক)
        ...(isActive ? {} : { lastCheckedAt: null }),
      },
    });

    // ৪. ক্যাশ রিভ্যালিডেট করা যাতে UI সাথে সাথে আপডেট হয়
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

// export async function getAiMonitoringStatus() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session || !session.user) {
//       return { success: false, error: 'Unauthorized' };
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: {
//         isAiMonitoringActive: true,
//         lastCheckedAt: true,
//       },
//     });

//     return {
//       success: true,
//       data: {
//         isAiMonitoringActive: user?.isAiMonitoringActive ?? false,
//         lastCheckedAt: user?.lastCheckedAt ?? null,
//       },
//     };
//   } catch (error) {
//     console.error('Failed to fetch AI status:', error);
//     return { success: false, error: 'Failed to load status' };
//   }
// }

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const [user, googleAccount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          isAiMonitoringActive: true,
          lastCheckedAt: true,
        },
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