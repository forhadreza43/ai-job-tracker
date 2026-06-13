import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function JobDetailsSkeleton() {
  return (
    <div>
      {/* Back Button Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        {/* Header Skeleton */}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              {/* Job Title */}
              <Skeleton className="h-8 w-62.5 md:w-100" />
              {/* Company Name */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>
            {/* Status Badge */}
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Metadata Grid Skeleton */}
          <div className="grid grid-cols-2 llg:grid-cols-3 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Heading */}
                <Skeleton className="h-5 w-32" /> {/* Value */}
              </div>
            ))}
          </div>

          {/* Description Skeleton */}
          <div>
            <Skeleton className="h-5 w-28 mb-3" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>

          {/* Responsibilities / Lists Skeleton (Representative Block) */}
          <div>
            <Skeleton className="h-5 w-36 mb-3" />
            <ul className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
                  <Skeleton
                    className={`h-4 ${i % 2 === 0 ? 'w-[80%]' : 'w-[60%]'}`}
                  />{' '}
                  {/* Text */}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills (Pill Tags) Skeleton */}
          <div>
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
            </div>
          </div>

          {/* Qualifications / Benefits Skeleton (Representative Block) */}
          <div>
            <Skeleton className="h-5 w-32 mb-3" />
            <ul className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
                  <Skeleton
                    className={`h-4 ${i === 1 ? 'w-[70%]' : 'w-[85%]'}`}
                  />{' '}
                  {/* Text */}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
