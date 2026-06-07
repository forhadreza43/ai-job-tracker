import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BarChartSkeleton() {
  return (
    <Card className="w-full">
      {/* Header Skeleton */}
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-28" />
      </CardHeader>

      {/* Chart Content Mockup */}
      <CardContent>
        {/* Matches standard aspect ratio/height of the ChartContainer */}
        <div className="flex h-[240px] w-full flex-col justify-between pt-4">
          {/* Fake Grid Lines & Simulated Vertical Bars */}
          <div className="relative flex flex-1 items-end justify-around border-b border-muted px-4 pb-2">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
              <div className="w-full border-t border-muted/50" />
              <div className="w-full border-t border-muted/50" />
              <div className="w-full border-t border-muted/50" />
            </div>

            {/* Simulated Bars (Varying heights mimicking data) */}
            <Skeleton className="h-[40%] w-22 rounded-t-md" />
            <Skeleton className="h-[75%] w-22 rounded-t-md" />
            <Skeleton className="h-[55%] w-22 rounded-t-md" />
            <Skeleton className="h-[90%] w-22 rounded-t-md" />
            <Skeleton className="h-[65%] w-22 rounded-t-md" />
            <Skeleton className="h-[45%] w-22 rounded-t-md" />
          </div>

          {/* Fake X-Axis Labels */}
          <div className="flex justify-around pt-3 px-4">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      </CardContent>

      {/* Footer Skeleton */}
      {/* <CardFooter className="flex-col items-start gap-2 pt-0">
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-3 w-64" />
      </CardFooter> */}
    </Card>
  );
}
