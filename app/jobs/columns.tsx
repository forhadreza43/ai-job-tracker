'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Job, Company } from '@/generated/prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export type JobWithCompany = Job & {
  company: Company | null;
};

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'companyId',
    id: 'companyName',
    accessorFn: (row) => row.company?.name || 'N/A',
    header: 'Company',
  },
  // {
  //   accessorKey: 'role',
  //   header: 'Role',
  //   cell: ({ row }) => {
  //     const role = row.getValue('role') as string | null;
  //     return (
  //       role || <span className="text-muted-foreground">Not specified</span>
  //     );
  //   },
  // },
  {
    accessorKey: 'jobType',
    header: 'Job Type',
    cell: ({ row }) => {
      const type = row.getValue('jobType') as string | null;
      if (!type) return <span className="text-muted-foreground">-</span>;
      return <Badge variant="outline">{type.replace('_', ' ')}</Badge>;
    },
  },
  {
    accessorKey: 'workMode',
    header: 'Work Mode',
    cell: ({ row }) => {
      const mode = row.getValue('workMode') as string | null;
      if (!mode) return <span className="text-muted-foreground">-</span>;
      return <Badge variant="secondary">{mode.replace('_', ' ')}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      // Optional: change badge color based on status
      const variant =
        status === 'APPLIED' || status === 'INTERVIEWING'
          ? 'default'
          : 'secondary';
      return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>;
    },
  },
  // {
  //   accessorKey: 'status',
  //   header: 'Status',
  // },
  {
    accessorKey: 'applicationDeadline',
    // Add sorting interaction to the header
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('applicationDeadline') as Date | null;
      return date ? (
        new Date(date).toLocaleDateString()
      ) : (
        <span className="text-muted-foreground">No deadline</span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(job.id)}
            >
              Copy Job ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/jobs/${job.id}`}>View details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
