import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-4 @5xl/main:grid-cols-6 dark:*:data-[slot=card]:bg-card">
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} className="@container/card">
          <CardHeader className="gap-2">
            {/* Skeleton for CardDescription text */}
            <Skeleton className="h-4 w-24" />

            {/* Skeleton for CardTitle text/number */}
            <div className="py-1">
              <Skeleton className="h-8 w-16 @[250px]/card:h-9 @[250px]/card:w-20" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
