'use server';

import { prisma } from '@/lib/prisma';
import { cacheTag } from 'next/cache';

export async function getJobs(userId: string) {
  // 'use cache';
  if (!userId) return [];

  try {
    // cacheTag(`jobs-user-${userId}`);

    const jobs = await prisma.job.findMany({
      where: { userId: userId },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });

    // jobs.forEach((job) => {
    //   cacheTag(`job-${job.id}`);
    // });

    return jobs;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
}

export async function getJobById(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    return job;
  } catch (error) {
    console.error('Failed to fetch job details:', error);
    throw new Error('Failed to fetch job details');
  }
}

export async function getCompany(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    return company;
  } catch (error) {
    console.error('Failed to fetch company details:', error);
    throw new Error('Failed to fetch company details');
  }
}
