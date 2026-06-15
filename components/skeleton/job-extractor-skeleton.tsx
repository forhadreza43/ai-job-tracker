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
    </div>
  );
}