'use server';

import { ApplicationStatus } from '@/generated/prisma/browser';
import { prisma } from '@/lib/prisma';

export async function getDashboardStats(userId: string) {
  if (!userId) {
    throw new Error('Unauthorized: User ID is required.');
  }

  try {
    const [generalStats, bookmarkedCount, statusGroups, uniqueCompanies] =
      await Promise.all([
        // 1. Get total jobs count
        prisma.job.aggregate({
          where: { userId },
          _count: { id: true },
        }),

        // 2. Get total bookmarked jobs count
        prisma.job.count({
          where: { userId, bookmarked: true },
        }),

        // 3. Group by application status to count each state in one query
        prisma.job.groupBy({
          by: ['status'],
          where: { userId },
          _count: { status: true },
        }),

        // 4. Group by companyId to get the unique count of companies applied to
        prisma.job.groupBy({
          by: ['companyId'],
          where: {
            userId,
            companyId: { not: null },
          },
        }),
      ]);

    const initialStatusMap: Record<ApplicationStatus, number> = {
      SAVED: 0,
      APPLIED: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      ASSESSMENT: 0,
      OFFER: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    // Map the results from the database group-by operation into our status object
    const statusCounts = statusGroups.reduce((acc, current) => {
      acc[current.status] = current._count.status;
      return acc;
    }, initialStatusMap);

    return {
      totalJobs: generalStats._count.id,
      totalBookmarked: bookmarkedCount,
      totalCompanies: uniqueCompanies.length, // Total distinct companies mapped to this user's jobs
      totalApplied: statusCounts.APPLIED,
      totalInterviewed: statusCounts.INTERVIEW, // maps to INTERVIEW enum
      totalShortlisted: statusCounts.SHORTLISTED,
      totalAssessment: statusCounts.ASSESSMENT,
      totalOffer: statusCounts.OFFER,
      totalRejected: statusCounts.REJECTED,
      totalWithdrawn: statusCounts.WITHDRAWN,
    };
  } catch (error) {
    console.error('Dashboard calculation error:', error);
    throw new Error('Failed to load dashboard metrics.');
  }
}

