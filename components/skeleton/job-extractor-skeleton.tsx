import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function JobExtractorSkeleton() {
  return (
    <div className="space-y-8 container max-w-360 mx-auto px-4 mt-4">
      {/* Input Card Skeleton */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-36" /> {/* CardTitle */}
          <Skeleton className="h-4 w-56" /> {/* CardDescription */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Textarea Placeholder - Exact matching responsive heights */}
          <Skeleton className="min-h-64 md:min-h-80 lg:min-h-120 w-full rounded-md" />

          {/* Bottom Action Bar */}
          <div className="flex flex-col gap-3 md:flex-row items-center justify-between">
            <Skeleton className="h-10 w-full md:w-44" /> {/* ModelSelector */}
            <Skeleton className="h-11 w-full md:w-50" /> {/* Extract Button */}
          </div>
        </CardContent>
      </Card>

      {/* Results Mock Skeleton 
        Render this conditionally when the AI is processing: {loading && <ResultSkeleton />}
      */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-56" /> {/* Extracted Title Header */}
            <Skeleton className="h-4 w-36" /> {/* Extracted Subtitle */}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metadata Grid Mock */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" /> {/* Meta label */}
                  <Skeleton className="h-5 w-32" /> {/* Meta value */}
                </div>
              ))}
            </div>

            {/* Description Paragraph Block Mock */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Save Bar Mock */}
        <div className="border-t pt-4 flex">
          <Skeleton className="ml-auto h-10 w-28 rounded-md" />{' '}
          {/* Save Button */}
        </div>
      </div>
    </div>
  );
}
