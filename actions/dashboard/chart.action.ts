'use server';
import { prisma } from '@/lib/prisma';

export async function getCompanyJobCounts(userId: string) {
  if (!userId) {
    throw new Error('Unauthorized: User ID is required.');
  }

  try {
    const data = await prisma.company.findMany({
      where: {
        jobs: {
          some: { userId },
        },
      },
      select: {
        name: true,
        _count: {
          select: {
            jobs: {
              where: { userId },
            },
          },
        },
      },
    });

    const chartData = data.map((item) => ({
      company: item.name,
      jobs: item._count.jobs,
    }));

    return chartData.sort((a, b) => b.jobs - a.jobs);
  } catch (error) {
    console.error('Failed to fetch company job counts for chart:', error);
    throw new Error('Failed to load chart data.');
  }
}

export interface JobTypeStatItem {
  jobType: string;
  count: number;
  fill: string;
}

export async function getJobTypeDistribution(
  userId: string
): Promise<JobTypeStatItem[]> {
  if (!userId) {
    console.error(
      'getJobTypeDistribution: Missing authorized userId argument.'
    );
    return [];
  }

  try {
    const [stats, nullCount] = await Promise.all([
      prisma.job.groupBy({
        by: ['jobType'],
        where: {
          userId: userId,
          jobType: { not: null },
        },
        _count: {
          jobType: true,
        },
      }),
      prisma.job.count({
        where: {
          userId: userId,
          jobType: null,
        },
      }),
    ]);

    const result = stats.map((item) => {
      const typeKey = (item.jobType ?? 'other')
        .toLowerCase()
        .replace(/_/g, '-');

      return {
        jobType: typeKey,
        count: item._count.jobType,
        fill: `var(--color-${typeKey})`,
      };
    });

    if (nullCount > 0) {
      result.push({
        jobType: 'other',
        count: nullCount,
        fill: 'var(--color-other)',
      });
    }

    return result;
  } catch (error) {
    console.error(
      `Failed to fetch job type distribution for user ${userId}:`,
      error
    );
    return [];
  }
}

export interface WorkModeStatItem {
  workMode: string;
  count: number;
  fill: string;
}

export async function getWorkModeDistribution(
  userId: string
): Promise<WorkModeStatItem[]> {
  if (!userId) {
    console.error(
      'getWorkModeDistribution: Missing authorized userId argument.'
    );
    return [];
  }

  try {
    const stats = await prisma.job.groupBy({
      by: ['workMode'],
      where: {
        userId: userId,
      },
      _count: {
        workMode: true,
      },
    });

    return stats.map((item) => {
      const modeKey = item.workMode
        ? item.workMode.toLowerCase().replace(/_/g, '-')
        : 'other';

      return {
        workMode: modeKey,
        count: item._count.workMode,
        fill: `var(--color-${modeKey})`,
      };
    });
  } catch (error) {
    console.error(
      `Failed to fetch work mode distribution for user ${userId}:`,
      error
    );
    return [];
  }
}