import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
}

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Controls Bar Skeleton */}
      <div className="flex items-center justify-between">
        {/* Mobile View Selector / Desktop Tabs Mock */}
        <div className="flex items-center">
          {/* Mobile View Selector Placeholder */}
          <Skeleton className="h-9 w-32 @4xl/main:hidden" />

          {/* Desktop TabsList Placeholder */}
          <div className="hidden @4xl/main:flex gap-1 bg-muted p-1 rounded-lg">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-44 rounded-md" />
            <Skeleton className="h-8 w-36 rounded-md" />
            <Skeleton className="h-8 w-36 rounded-md" />
          </div>
        </div>

        {/* Action Buttons Right Side */}
        <div className="flex items-center gap-2">
          {/* Columns Selector Button */}
          <Skeleton className="h-8.5 w-24" />
          {/* Add Section Button */}
          <Skeleton className="h-8.5 w-28" />
        </div>
      </div>

      {/* Table Content Skeleton Box */}
      <div className="relative flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            {/* Table Header Structure */}
            <TableHeader className="bg-muted">
              <TableRow>
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableHead key={i} className={i === 0 ? 'w-8' : ''}>
                    <Skeleton className="h-8 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body Rows Structure */}
            <TableBody>
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columnCount }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {colIndex === 0 ? (
                        /* Drag Handle / Checkbox space indicator */
                        <Skeleton className="h-8.5 w-4 rounded" />
                      ) : (
                        /* Standard cell content representation */
                        <Skeleton
                          className={`h-4 ${
                            colIndex % 2 === 0 ? 'w-24' : 'w-32'
                          }`}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination Bar Skeleton */}
        <div className="flex items-center justify-between px-4">
          {/* Selection Stats (Desktop Only) */}
          <div className="hidden lg:flex flex-1">
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Pagination Controls */}
          <div className="flex w-full items-center gap-8 lg:w-fit">
            {/* Rows Per Page Indicator (Desktop Only) */}
            <div className="hidden items-center gap-2 lg:flex">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>

            {/* Page Count Counter */}
            <div className="flex w-fit items-center justify-center">
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Pagination Navigation Buttons */}
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              {/* First Page Button */}
              <Skeleton className="hidden h-8 w-8 lg:block rounded-md" />
              {/* Previous Page Button */}
              <Skeleton className="h-8 w-8 rounded-md" />
              {/* Next Page Button */}
              <Skeleton className="h-8 w-8 rounded-md" />
              {/* Last Page Button */}
              <Skeleton className="hidden h-8 w-8 lg:block rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
