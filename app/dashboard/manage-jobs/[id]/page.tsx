import JobDetails from '@/components/job-details';
import { JobDetailsSkeleton } from '@/components/skeleton/job-details-skeleton';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Details',
  description:
    'View the details of a tracked job application and its latest AI/email updates.',
};


const JobDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense fallback={<JobDetailsSkeleton />}>
      <JobDetailsLoader params={params} />
    </Suspense>
  );
};

async function JobDetailsLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetails id={id} />;
}

export default JobDetailsPage;
