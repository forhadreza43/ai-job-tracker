import ManageJobs from '@/components/manage-job';
import { DataTableSkeleton } from '@/components/skeleton/data-table-skeleton';
import { RouteRefresher } from '@/components/route-refresher';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Jobs',
  description: 'Browse, update, and manage all your tracked job applications.',
};

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
