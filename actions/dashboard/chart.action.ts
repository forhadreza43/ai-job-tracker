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
