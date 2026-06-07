
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { Suspense } from 'react';
import { StatsSkeleton } from '@/components/skeleton/section-cards-skeleton';
import { BarChartSkeleton } from '@/components/skeleton/barchart-skeleton';
import { Barchart } from '@/components/barchart';
import data from './data.json';

export default function Page() {
  return (
    <>
      <Suspense fallback={<StatsSkeleton />}>
        <SectionCards />
      </Suspense>
      <Suspense fallback={<BarChartSkeleton />}>
        <Barchart />
      </Suspense>

      <DataTable data={data} />
    </>
  );
}
