'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { JobExtraction } from '@/types/job-extraction';
import {
  JobType,
  WorkMode,
  ApplicationStatus,
} from '@/generated/prisma/client';

export interface SaveJobResult {
  success: boolean;
  jobId?: string;
  companyId?: string;
  error?: string;
}

export async function saveJob(
  userId: string,
  extraction: JobExtraction
): Promise<SaveJobResult> {
  try {
    if (!extraction.companyName) {
      return {
        success: false,
        error: 'Company name is required',
      };
    }

    let companyId: string | null = null;

    if (extraction.companyName) {
      const company = await prisma.company.upsert({
        where: { name: extraction.companyName },
        update: {},
        create: {
          name: extraction.companyName,
        },
      });
      companyId = company.id;
    }

    const job = await prisma.job.create({
      data: {
        userId,
        companyId,
        title: extraction.title as string,
        role: extraction.role,
        subjectLine: extraction.subjectLine,
        source: extraction.source,
        sourceUrl: extraction.sourceUrl,
        location: extraction.location,
        workMode: extraction.workMode,
        jobType: extraction.jobType,
        experienceLevel: extraction.experienceLevel,
        experienceRequired: extraction.experienceRequired,
        vacancy: extraction.vacancy,
        officeTime: extraction.officeTime,
        circularDate: extraction.circularDate
          ? new Date(`${extraction.circularDate}T00:00:00.000Z`)
          : null,
        applicationDeadline: extraction.applicationDeadline
          ? new Date(`${extraction.applicationDeadline}T00:00:00.000Z`)
          : null,
        salaryMin: extraction.salaryMin,
        salaryMax: extraction.salaryMax,
        salaryCurrency: extraction.salaryCurrency,
        salaryNegotiable: extraction.salaryNegotiable ?? false,
        skills: extraction.skills as string[],
        responsibilities: extraction.responsibilities as string[],
        qualifications: extraction.qualifications as string[],
        niceToHave: extraction.niceToHave as string[],
        benefits: extraction.benefits as string[],
        applicationProcess: extraction.applicationProcess,
        description: extraction.description as string,
        rawText: extraction.rawText as string,
        aiConfidence: extraction.confidence,
      },
    });

    // updateTag(`jobs-user-${userId}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/manage-jobs');

    return {
      success: true,
      jobId: job.id,
      companyId: companyId as string,
    };
  } catch (error) {
    console.error('Failed to save job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save job',
    };
  }
}

export async function getCompanies(
  userId: string
): Promise<{ id: string; name: string }[]> {
  const companies = await prisma.company.findMany({
    where: {
      jobs: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return companies;
}

interface GetJobsParams {
  userId: string;
  page?: number;
  pageSize?: number;

  search?: string;

  status?: ApplicationStatus;
  jobType?: JobType;
  workMode?: WorkMode;

  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getJobs({
  userId,
  page = 1,
  pageSize = 15,
  search = '',
  status,
  jobType,
  workMode,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: GetJobsParams) {
  const where = {
    userId,

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          role: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          company: {
            name: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        },
      ],
    }),

    ...(status && { status }),
    ...(jobType && { jobType }),
    ...(workMode && { workMode }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),

    prisma.job.count({
      where,
    }),
  ]);

  return {
    jobs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
