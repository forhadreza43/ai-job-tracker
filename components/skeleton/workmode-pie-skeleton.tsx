import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function WorkModeChartSkeleton() {
  return (
    <Card className="flex flex-col w-full h-[380px] justify-between">
      {/* Header Skeleton */}
      <CardHeader className="items-center pb-0 gap-2">
        <Skeleton className="h-5 w-52" /> {/* CardTitle */}
        <Skeleton className="h-4 w-60" /> {/* CardDescription */}
      </CardHeader>

      {/* Content Skeleton */}
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        {/* Container matches the ChartContainer's exact dimensions */}
        <div className="mx-auto aspect-square w-full max-w-[230px] flex items-center justify-center p-4">
          {/* Solid Pie Skeleton */}
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
