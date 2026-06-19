import { JobTrackerContent } from '@/components/job-extractor';
import { JobExtractorSkeleton } from '@/components/skeleton/job-extractor-skeleton';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <>
      
      <div className="flex-1 flex flex-col">
        <Suspense fallback={<JobExtractorSkeleton />}>
          <JobTrackerContent />
        </Suspense>
      </div>
    </>
  );
}
