import JobDetails from '@/components/job-details';
import { JobDetailsSkeleton } from '@/components/skeleton/job-details-skeleton';
import React, { Suspense } from 'react';

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<JobDetailsSkeleton />}>
      <JobDetails id={resolvedParams?.id} />
    </Suspense>
  );
};

export default JobDetailsPage;
