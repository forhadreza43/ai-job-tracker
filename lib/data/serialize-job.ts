import type { Company, Job } from '@/generated/prisma/client';

export type SerializedJob = Omit<Job, 'salaryMin' | 'salaryMax'> & {
  salaryMin: number | null;
  salaryMax: number | null;
};

export type SerializedJobWithCompany = SerializedJob & {
  company: Company | null;
};

export function serializeJob<T extends Job>(job: T): SerializedJob & Omit<T, keyof Job> {
  return {
    ...job,
    salaryMin: job.salaryMin != null ? Number(job.salaryMin) : null,
    salaryMax: job.salaryMax != null ? Number(job.salaryMax) : null,
  };
}
