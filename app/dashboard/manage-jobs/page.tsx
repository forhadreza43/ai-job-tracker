import ManageJobs from '@/components/manage-job';
import { DataTableSkeleton } from '@/components/skeleton/data-table-skeleton';
import { Suspense } from 'react';

const ManageJobsPage = async () => {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <ManageJobs />
    </Suspense>
  );
};

export default ManageJobsPage;
