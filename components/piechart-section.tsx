import { JobTypePieChart } from '@/components/jobtype-pie';
import { WorkModePieChart } from '@/components/workmode-pie';
import { JobTypePieChartSkeleton } from '@/components/skeleton/jobtype-pie-skeleton';
import { WorkModeChartSkeleton } from '@/components/skeleton/workmode-pie-skeleton';
import { session } from '@/actions/auth/auth.action';
import {
  getJobTypeDistribution,
  getWorkModeDistribution,
} from '@/actions/dashboard/chart.action';
import { Suspense } from 'react';

export const PieChartSection = async () => {
  const sessionData = await session();
  const userId = sessionData?.user?.id as string;

  const jobTypeData = await getJobTypeDistribution(userId);
  const workModeData = await getWorkModeDistribution(userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      <Suspense fallback={<JobTypePieChartSkeleton />}>
        <JobTypePieChart initialData={jobTypeData} />
      </Suspense>
      <Suspense fallback={<WorkModeChartSkeleton />}>
        <WorkModePieChart initialData={workModeData} />
      </Suspense>
    </div>
  );
};
