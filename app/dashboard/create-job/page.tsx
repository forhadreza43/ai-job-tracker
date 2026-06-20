import { JobTrackerContent } from '@/components/create-job';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Create Job Application',
  description:
    'Paste a job description and use AI to extract structured application details, then save it to your tracker.',
};

export default function CreateJobPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading Extraction Engine...
        </div>
      }
    >
      <JobTrackerContent />
    </Suspense>
  );
}
