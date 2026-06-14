import React from 'react';
import { JobTypePieChartSkeleton } from '@/components/skeleton/jobtype-pie-skeleton';
import { WorkModeChartSkeleton } from '@/components/skeleton/workmode-pie-skeleton';

export default function WorkmodeJobtypeSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      <JobTypePieChartSkeleton />
      <WorkModeChartSkeleton />
    </div>
  );
}
