import { JobTrackerContent } from '@/components/job-extractor';
import { Navbar } from '@/components/navbar/navbar';
import { JobExtractorSkeleton } from '@/components/skeleton/job-extractor-skeleton';
import { Suspense } from 'react';



export default function HomePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<JobExtractorSkeleton />}>
        <JobTrackerContent />
      </Suspense>
    </>
  );
}
