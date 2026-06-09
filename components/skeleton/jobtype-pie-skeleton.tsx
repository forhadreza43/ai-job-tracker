import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function JobTypePieChartSkeleton() {
  return (
    <Card className="flex flex-col w-full h-[380px] justify-between">
      {/* Header Skeleton */}
      <CardHeader className="items-center pb-0 gap-2">
        <Skeleton className="h-5 w-48" /> {/* CardTitle */}
        <Skeleton className="h-4 w-56" /> {/* CardDescription */}
      </CardHeader>

      {/* Content Skeleton */}
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        {/* Container matches the ChartContainer's exact dimensions */}
        <div className="mx-auto aspect-square w-full max-w-[230px] relative flex items-center justify-center">
          {/* Outer Pie Skeleton */}
          <Skeleton className="absolute inset-0 h-full w-full rounded-full" />

          {/* Inner Cutout (Mimics innerRadius={55}) */}
          {/* bg-card matches the card background to create the "hole" */}
          <div className="absolute z-10 flex h-[110px] w-[110px] flex-col items-center justify-center gap-2 rounded-full bg-card">
            {/* Center Text Skeletons */}
            <Skeleton className="h-8 w-16" /> {/* Number */}
            <Skeleton className="h-3 w-14" /> {/* "Total Jobs" */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
