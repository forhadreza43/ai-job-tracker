import { JobTrackerContent } from '@/components/job-extractor';
import { JobExtractorSkeleton } from '@/components/skeleton/job-extractor-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <>
      <div className="px-4 text-center mt-22 container max-w-360 mx-auto">
        <Card className="py-10">
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl font-medium text-foreground mb-3">
                Track your job applications — all in one place
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              APPLI-TRACT helps job seekers organise applications, extract job
              details from circulars using AI, and get notified when interview
              or assessment emails arrive in their inbox.
            </p>
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              <span className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                AI job parsing
              </span>
              <span className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                Application tracking
              </span>
              <span className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                Gmail monitoring
              </span>
              <span className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                Interview alerts
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 flex flex-col">
        <Suspense fallback={<JobExtractorSkeleton />}>
          <JobTrackerContent />
        </Suspense>
      </div>
    </>
  );
}
