import ManageJobs from '@/components/manage-job';
import { DataTableSkeleton } from '@/components/skeleton/data-table-skeleton';
import { RouteRefresher } from '@/components/route-refresher';
import { Suspense } from 'react';

const ManageJobsPage = async () => {
  return (
    <>
      <RouteRefresher />
      <Suspense fallback={<DataTableSkeleton />}>
        <ManageJobs />
      </Suspense>
    </>
  );
};

export default ManageJobsPage;
