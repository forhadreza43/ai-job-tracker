import { SectionCards } from '@/components/section-cards';
import { Suspense } from 'react';
import { StatsSkeleton } from '@/components/skeleton/section-cards-skeleton';
import { BarChartSkeleton } from '@/components/skeleton/barchart-skeleton';
import { Barchart } from '@/components/barchart';
import { PieChartSection } from '@/components/piechart-section';
import WorkmodeJobtypeSkeleton from '@/components/skeleton/workmode-jobtype-skeleton';
export default function Page() {
  return (
    <>
      <Suspense fallback={<StatsSkeleton />}>
        <SectionCards />
      </Suspense>
      <Suspense fallback={<BarChartSkeleton />}>
        <Barchart />
      </Suspense>
      <Suspense fallback={<WorkmodeJobtypeSkeleton/>}>
        <PieChartSection />
      </Suspense>
    </>
  );
}
