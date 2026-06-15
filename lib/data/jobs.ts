import { prisma } from '@/lib/prisma';
import {
  serializeJob,
  type SerializedJobWithCompany,
} from '@/lib/data/serialize-job';

export async function getJobs(userId: string): Promise<SerializedJobWithCompany[]> {

  if (!userId) return [];

  try {
    const jobs = await prisma.job.findMany({
      where: { userId },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map(serializeJob);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
}

export async function getJobById(jobId: string) {
  // 'use cache';
  // cacheLife('max');
  // cacheTag(`job-${jobId}`);

  try {
    return await prisma.job.findUnique({
      where: { id: jobId },
    });
  } catch (error) {
    console.error('Failed to fetch job details:', error);
    throw new Error('Failed to fetch job details');
  }
}

export async function getCompany(companyId: string) {
  try {
    return await prisma.company.findUnique({
      where: { id: companyId },
    });
  } catch (error) {
    console.error('Failed to fetch company details:', error);
    throw new Error('Failed to fetch company details');
  }
}
