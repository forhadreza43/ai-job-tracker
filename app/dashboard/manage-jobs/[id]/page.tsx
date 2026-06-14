import JobDetails from '@/components/job-details';
import { JobDetailsSkeleton } from '@/components/skeleton/job-details-skeleton';
import { Suspense } from 'react';

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
